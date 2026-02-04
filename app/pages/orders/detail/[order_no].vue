<template>
	<UDashboardPanel id="orders-detail">
		<template #header>
			<UDashboardNavbar :title="$t('pages.orderDetail')">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZLoading v-if="loading" />
			<div v-else class="order-detail-container">
				<!-- Header Section -->
				<div class="order-header">
					<div class="order-header-left">
						<div class="order-header-title">
							<h1 class="order-number">{{ order?.order_no }}</h1>
						</div>
						<div class="flex flex-col">
							<div v-if="order?.order_date_time" class="metadata-item">
								<UIcon :name="ICONS.CALENDAR" class="w-4 h-4 text-main" />
								<p>{{ order?.order_date_time }}</p>
							</div>
							<div v-if="order?.trace_no" class="metadata-item">
								<p class="text-sm text-neutral-400 italic">{{ order?.trace_no }}</p>
							</div>
							<div v-if="order?.ref_no" class="metadata-item">
								<p>{{ $t('components.orderDetail.refLabel') }}: {{ order?.ref_no }}</p>
							</div>
						</div>
					</div>
					<div class="order-header-right">
						<div class="status-badges">
							<UButton
								color="primary"
								:icon="ICONS.SYNC_ROUNDED"
								variant="ghost"
								:disabled="is_refreshing || refresh_cooldown > 0"
								:loading="is_refreshing"
								:class="{ 'spin-icon': is_refreshing }"
								@click="refreshOrder"
							>
								{{ refresh_button_text }}
							</UButton>

							<div class="status-group">
								<UBadge v-if="order?.status === OrderStatus.PENDING_PAYMENT" variant="subtle" color="info" size="lg">{{ $t('options.pendingPayment') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.PROCESSING" color="info" size="lg">{{ $t('options.processing') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.COMPLETED" color="success" size="lg">{{ $t('options.completed') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.REQUIRES_ACTION" color="warning" size="lg">{{ $t('options.requiresAction') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.REFUNDED" color="error" size="lg">{{ $t('options.refunded') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.CANCELLED" color="error" size="lg">{{ $t('options.cancelled') }}</UBadge>
							</div>
						</div>
					</div>
				</div>

				<!-- Main Grid Layout -->
				<div class="wrapper-grid">
					<div class="main-wrapper">
						<!-- Customer Detail -->
						<UCard class="customer-card">
							<template #header>
								<div class="card-header">
									<h2 class="card-title">
										<UIcon :name="ICONS.CUSTOMER_GROUP_ROUNDED" class="w-5 h-5" />
										{{ $t('components.orderDetail.customerInformation') }}
									</h2>
									<UButton variant="ghost" :icon="ICONS.PENCIL" size="sm" @click="editCustomerDetail">{{ $t('components.orderDetail.edit') }}</UButton>
								</div>
							</template>
							<ZSectionOrderDetailCustomer :customer="customer" />
						</UCard>

						<!-- Order Items -->
						<UCard class="items-card">
							<template #header>
								<div class="card-header">
									<h2 class="card-title">
										<UIcon :name="ICONS.PRODUCT" class="w-5 h-5" />
										{{ $t('components.orderDetail.orderItems') }}
									</h2>
									<div class="flex items-center gap-2">
										<span v-if="order?.status === OrderStatus.PENDING_PAYMENT" class="text-xs text-green-600 font-medium">
											<UIcon name="i-heroicons-pencil" class="w-3 h-3" />
											{{ $t('components.orderDetail.editable') }}
										</span>
										<UPopover v-else overlay>
											<UButton color="neutral" :trailing-icon="ICONS.QUESTION_MARK" variant="soft" size="xs" />
											<template #content>
												<div class="p-4 max-w-xs">
													<p class="text-sm">
														{{ $t('components.orderDetail.orderNotEditableMessage') }}<br />
														<b class="text-primary">{{ $t('components.orderDetail.changeStatusToEdit') }}</b>
													</p>
												</div>
											</template>
										</UPopover>
									</div>
								</div>
							</template>

							<ZSectionOrderDetailItems
								:items="items ?? []"
								:currency-code="currency_code"
								:total-gross-amt="order?.gross_amt"
								:total-net-amt="order?.net_total"
								:taxes="order?.taxes ?? []"
								:editable="order?.status == OrderStatus.PENDING_PAYMENT"
								@refresh="getOrderByTransactionNo()"
							/>
						</UCard>

						<!-- Remarks Section -->
						<UCard v-if="order?.remarks" class="remarks-card">
							<template #header>
								<div class="card-header">
									<h2 class="card-title">
										<UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-5 h-5" />
										{{ $t('components.orderDetail.remarks') }}
									</h2>
								</div>
							</template>
							<p class="remarks-text">{{ order?.remarks }}</p>
						</UCard>
					</div>

					<!-- Sidebar -->
					<div v-if="order !== undefined" class="side-wrapper">
						<div class="sticky-sidebar">
							<!-- Status Management -->
							<UCard class="status-management-card">
								<template #header>
									<h3 class="sidebar-title">{{ $t('components.orderDetail.orderStatus') }}</h3>
								</template>

								<div class="status-section">
									<ZSelectMenuOrderStatus v-model:status="new_order_status" />
									<UButton
										block
										color="primary"
										:icon="ICONS.SAVE"
										:disabled="new_order_status === order?.status || updating"
										:loading="updating"
										@click="handleUpdateOrderStatus"
									>
										{{ $t('components.orderDetail.updateOrderStatus') }}
									</UButton>
								</div>
							</UCard>

							<!-- Payment Information -->
							<UCard class="payment-info-card">
								<template #header>
									<div class="card-header-sidebar">
										<h3 class="sidebar-title">{{ $t('components.orderDetail.paymentInformation') }}</h3>
										<UButton v-if="order.payments?.length == 0" variant="ghost" size="xs" :icon="ICONS.ADD_OUTLINE" @click="addPaymentInfo" />
										<div v-if="order?.payment_status === PaymentStatus.PAID" class="status-group">
											<UBadge color="success" size="lg">
												<UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
												{{ $t('components.orderDetail.paid') }}
											</UBadge>
										</div>
									</div>
								</template>

								<div v-if="order.payments && order.payments.length > 0" class="payments-list">
									<div v-for="payment in order.payments" :key="payment.payment_line" class="payment-item" @click="viewPaymentInfo(payment)">
										<div class="payment-header">
											<span class="payment-type">{{ payment.payment_type_desc }}</span>
											<span class="payment-amount">{{ payment.currency_code }} {{ payment.payment_amt?.toFixed(2) }}</span>
										</div>
										<div v-if="payment.ref_no1" class="payment-ref">
											<span class="payment-ref-label">{{ $t('components.orderDetail.refLabel') }}:</span>
											<span class="payment-ref-value">{{ payment.ref_no1 }}</span>
										</div>
										<div class="payment-date">
											<UIcon name="i-heroicons-clock" class="w-3 h-3" />
											{{ getFormattedDate(payment.payment_date_time, 'dd MMM yyyy HH:mm') }}
										</div>
									</div>
								</div>
								<div v-else class="payment-empty">
									<UIcon name="i-heroicons-currency-dollar" class="w-12 h-12 text-neutral-300" />
									<p class="payment-empty-text">{{ $t('components.orderDetail.noPaymentRecorded') }}</p>
									<UButton size="sm" color="primary" :icon="ICONS.ADD_OUTLINE" @click="addPaymentInfo">{{ $t('components.orderDetail.addPayment') }}</UButton>
								</div>
							</UCard>
						</div>
					</div>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalOrderDetailCustomer, ZModalOrderDetailPayment } from '#components';
import { OrderStatus, PaymentStatus, getFormattedDate } from 'wemotoo-common';
import { failedModal, successNotification } from '~/stores/AppUi/AppUi';
import type { PaymentModel } from '~/utils/models';
import { ICONS } from '~/utils/icons';
import type { Order } from '~/utils/types/order';

const orderStore = useOrderStore();
const { detail, loading, updating } = storeToRefs(orderStore);

const overlay = useOverlay();
const order = computed<Order | undefined>(() => detail.value);
const new_order_status = ref<OrderStatus>(order.value?.status || OrderStatus.PENDING_PAYMENT);
const customer = computed(() => order.value?.customer);
const items = computed(() => order.value?.items);
const currency_code = computed(() => order.value?.currency.code);

// Refresh cooldown management
const REFRESH_COOLDOWN_SECONDS = 5;
const refresh_cooldown = ref(0);
const is_refreshing = ref(false);
let cooldown_interval: NodeJS.Timeout | null = null;

// Check if screen is mobile
const isMobile = ref(false);

const checkMobile = () => {
	isMobile.value = window.innerWidth < 640; // sm breakpoint
};

// Watch for order changes to update the new_order_status
watch(
	() => order.value?.status,
	(newStatus) => {
		if (newStatus) {
			new_order_status.value = newStatus;
		}
	},
);

const { t } = useI18n();
useHead({ title: () => t('pages.orderDetailTitle') + (order.value?.order_no ?? '') });

onMounted(async () => {
	const route = useRoute();
	await orderStore.getOrderByOrderNo(route.params.order_no as string);
	checkMobile();
	window.addEventListener('resize', checkMobile);
});

onBeforeRouteLeave(() => {
	orderStore.resetDetail();
	if (cooldown_interval) {
		clearInterval(cooldown_interval);
	}
});

onBeforeUnmount(() => {
	if (cooldown_interval) {
		clearInterval(cooldown_interval);
	}
	window.removeEventListener('resize', checkMobile);
});

const getOrderByTransactionNo = async () => {
	try {
		await orderStore.getOrderByOrderNo(order.value!.order_no);
	} catch {
		return navigateTo('/orders');
	}
};

/* Refresh Order with Cooldown */
const refreshOrder = async () => {
	// Check if already refreshing or on cooldown
	if (is_refreshing.value || refresh_cooldown.value > 0) {
		return;
	}

	if (!order.value?.order_no) return;

	is_refreshing.value = true;

	try {
		await getOrderByTransactionNo();
		successNotification(t('components.orderDetail.refreshSuccess'));

		// Start cooldown timer
		refresh_cooldown.value = REFRESH_COOLDOWN_SECONDS;

		// Clear existing interval if any
		if (cooldown_interval) {
			clearInterval(cooldown_interval);
		}

		// Countdown interval
		cooldown_interval = setInterval(() => {
			refresh_cooldown.value -= 1;
			if (refresh_cooldown.value <= 0) {
				if (cooldown_interval) {
					clearInterval(cooldown_interval);
					cooldown_interval = null;
				}
			}
		}, 1000);
	} catch (error) {
		console.error('Failed to refresh order:', error);
	} finally {
		is_refreshing.value = false;
	}
};

const refresh_button_text = computed(() => {
	// Hide text on mobile
	if (isMobile.value) {
		return '';
	}

	if (refresh_cooldown.value > 0) {
		return t('components.orderDetail.waitSeconds', { n: refresh_cooldown.value });
	}
	return t('components.orderDetail.refresh');
});

/* Handle Update Order Status */
const handleUpdateOrderStatus = async () => {
	await updateOrderStatus(new_order_status.value);
};

/* Update Order Status		*/
const updateOrderStatus = async (new_status: OrderStatus) => {
	if (!order.value) {
		throw new Error('Order not found');
	}

	if (new_status == OrderStatus.CANCELLED) {
		failedModal(t('components.orderDetail.confirmCancelOrder'));
		return;
	}

	if (new_status == OrderStatus.COMPLETED && order.value.payment_status == PaymentStatus.PENDING) {
		failedModal(t('components.orderDetail.paymentRequiredMessage'), t('components.orderDetail.paymentInfoRequired'));
		return;
	}

	try {
		await orderStore.updateOrderStatus(order.value.order_no, order.value.customer.customer_no, new_status);
		successNotification(t('components.orderDetail.statusUpdateSuccess'));
	} catch {
		failedModal(t('components.orderDetail.statusUpdateFailed'), t('components.orderDetail.error'));
	}
};

/* Edit Customer Detail */
const editCustomerDetail = async () => {
	if (!customer.value) return;

	const customerModal = overlay.create(ZModalOrderDetailCustomer, {
		props: {
			customer: JSON.parse(JSON.stringify(customer.value)),
			onUpdate: () => {
				customerModal.close();
				refreshOrder();
			},
			onCancel: () => {
				customerModal.close();
			},
		},
	});

	customerModal.open();
};

/* Add Payment Info */
const addPaymentInfo = () => {
	const paymentModal = overlay.create(ZModalOrderDetailPayment, {
		props: {
			onUpdate: () => {
				paymentModal.close();
				refreshOrder();
			},
			onCancel: () => {
				paymentModal.close();
			},
		},
	});

	paymentModal.open();
};

const viewPaymentInfo = (payment: PaymentModel) => {
	const paymentModal = overlay.create(ZModalOrderDetailPayment, {
		props: {
			payment: payment,
			onUpdate: () => {
				paymentModal.close();
				refreshOrder();
			},
			onCancel: () => {
				paymentModal.close();
			},
		},
	});

	paymentModal.open();
};
</script>

<style scoped>
/* Main Container */
.order-detail-container {
	max-width: 1600px;
	margin: 0 auto;
}

/* Order Header */
.order-header {
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 1rem;
	align-items: start;
	border-radius: 1rem;
	padding: 2rem;
	margin-bottom: 2rem;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
	.order-header {
		gap: 2rem;
	}
}

.order-header-left {
	min-width: 0;
}

.order-header-title {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.order-number {
	font-size: 1.875rem;
	font-weight: 700;
	line-height: 1.2;
	margin: 0;
}

.order-type {
	font-size: 0.875rem;
	opacity: 0.9;
	margin: 0.25rem 0 0 0;
}

.metadata-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
}

.order-header-right {
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
}

.status-badges {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: flex-end;
}

.status-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: flex-start;
}

@media (min-width: 768px) {
	.status-group {
		align-items: flex-end;
	}
}

/* Grid Layout */
.wrapper-grid {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1.5rem;
}

@media (min-width: 1024px) {
	.wrapper-grid {
		grid-template-columns: repeat(12, minmax(0, 1fr));
	}
}

.main-wrapper {
	grid-column: span 1 / span 1;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

@media (min-width: 1024px) {
	.main-wrapper {
		grid-column: span 8 / span 8;
	}
}

.side-wrapper {
	display: none;
	grid-column: span 1 / span 1;
}

@media (min-width: 1024px) {
	.side-wrapper {
		display: block;
		grid-column: span 4 / span 4;
	}
}

.sticky-sidebar {
	position: sticky;
	top: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* Card Headers */
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.card-header-sidebar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.card-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.125rem;
	font-weight: 600;
	color: var(--color-gray-800);
}

.sidebar-title {
	font-size: 1rem;
	font-weight: 600;
	color: var(--color-gray-800);
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

/* Cards */
.customer-card,
.items-card,
.remarks-card {
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	transition: box-shadow 0.2s ease;
}

.customer-card:hover,
.items-card:hover,
.remarks-card:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.remarks-text {
	font-size: 0.875rem;
	color: var(--color-gray-700);
	line-height: 1.6;
	white-space: pre-wrap;
}

/* Sidebar Cards */
.quick-actions-card,
.status-management-card,
.payment-info-card {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

/* Status Section */
.status-section {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.status-section-label {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-gray-700);
	text-transform: uppercase;
	letter-spacing: 0.025em;
}

/* Payment List */
.payments-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.payment-item {
	padding: 1rem;
	background: var(--color-gray-50);
	border-radius: 0.5rem;
	border: 1px solid var(--color-gray-200);
	cursor: pointer;
	transition: all 0.2s ease;
}

.payment-item:hover {
	background: var(--color-gray-100);
	border-color: var(--color-primary-300);
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.payment-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.payment-type {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-gray-800);
}

.payment-amount {
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-primary-600);
}

.payment-ref {
	display: flex;
	gap: 0.5rem;
	font-size: 0.75rem;
	margin-bottom: 0.25rem;
}

.payment-ref-label {
	color: var(--color-gray-500);
}

.payment-ref-value {
	color: var(--color-gray-700);
	font-weight: 500;
}

.payment-date {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.75rem;
	color: var(--color-gray-500);
}

.payment-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	text-align: center;
	gap: 1rem;
}

.payment-empty-text {
	color: var(--color-gray-500);
	font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 640px) {
	.order-header {
		padding: 1.5rem;
		gap: 1rem;
		grid-template-columns: 1fr auto;
	}

	.order-number {
		font-size: 1.5rem;
	}

	.status-badges {
		gap: 0.75rem;
	}
}

/* Spinning animation for refresh button */
.spin-icon :deep(svg) {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
