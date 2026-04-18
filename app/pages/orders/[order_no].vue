<template>
	<ZPagePanel id="orders-detail" :title="$t('pages.orderDetail')" back-to="/orders">
		<ZLoading v-if="loading" />
		<div v-else-if="order_not_found" class="order-not-found">
			<UIcon name="i-heroicons-magnifying-glass-circle" class="order-not-found-icon" />
			<p class="order-not-found-text">{{ $t('pages.orderNotFound', { orderNo: order_no_param }) }}</p>
			<UButton color="primary" variant="soft" :to="'/orders'">{{ $t('nav.orders') }}</UButton>
		</div>
		<div v-else class="order-detail-container">
			<!-- Header Section -->
			<div class="order-header">
				<div class="order-header-left">
					<div class="order-header-title">
						<h1 class="order-number">{{ record?.order_no }}</h1>
					</div>
					<div class="flex flex-col">
						<div v-if="record?.order_date_time" class="metadata-item">
							<UIcon :name="ICONS.CALENDAR" class="w-4 h-4 text-main" />
							<p>{{ record?.order_date_time }}</p>
						</div>
						<div v-if="record?.inv_no" class="metadata-item">
							<p class="text-base text-neutral-400 italic">{{ record?.inv_no }}</p>
						</div>
						<div v-if="record?.ref_no" class="metadata-item">
							<p>{{ $t('components.orderDetail.refLabel') }}: {{ record?.ref_no }}</p>
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

						<div class="status-badge-stack">
							<div class="status-group">
								<UBadge v-if="order?.status === OrderStatus.PENDING_PAYMENT" variant="subtle" color="info" size="lg">{{ $t('options.pendingPayment') }}</UBadge>
								<UBadge v-else-if="String(order?.status) === 'paid'" color="info" size="lg">{{ $t('options.paid') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.PROCESSING" color="info" size="lg">{{ $t('options.processing') }}</UBadge>
								<UBadge v-else-if="String(order?.status) === 'shipped'" color="primary" size="lg">{{ $t('options.shipped') }}</UBadge>
								<UBadge v-else-if="String(order?.status) === 'delivered'" color="success" size="lg">{{ $t('options.delivered') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.COMPLETED" color="success" size="lg">{{ $t('options.completed') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.REQUIRES_ACTION" color="warning" size="lg">{{ $t('options.requiresAction') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.REFUNDED" color="error" size="lg">{{ $t('options.refunded') }}</UBadge>
								<UBadge v-else-if="order?.status === OrderStatus.CANCELLED" color="error" size="lg">{{ $t('options.cancelled') }}</UBadge>
							</div>
							<p v-if="order?.last_updated" class="status-last-updated" :title="$t('table.lastUpdated')">
								{{ order.last_updated }}
							</p>
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
								<UButton variant="ghost" size="sm" @click="editCustomerDetail">
									<UIcon name="i-heroicons-pencil" class="w-3 h-3" />
									{{ $t('components.orderDetail.edit') }}
								</UButton>
							</div>
						</template>
						<ZSectionOrderDetailCustomer :customer="customer" />
					</UCard>

					<!-- Order Items -->
					<UCard v-if="orderForModal" class="items-card">
						<template #header>
							<div class="card-header">
								<h2 class="card-title">
									<UIcon :name="ICONS.PRODUCT" class="w-5 h-5" />
									{{ $t('components.orderDetail.orderItems') }}
								</h2>
								<div class="flex items-center gap-2">
									<span v-if="order?.status === OrderStatus.PENDING_PAYMENT" class="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
										<UIcon name="i-heroicons-pencil" class="w-3 h-3" />
										{{ $t('components.orderDetail.editable') }}
									</span>
									<span v-else-if="order?.status === OrderStatus.COMPLETED" class="text-xs text-green-600 font-medium">
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
							:order="orderForModal"
							:items="items ?? []"
							:currency-code="currency_code"
							:total-gross-amt="record?.gross_amt"
							:total-net-amt="order?.net_total"
							:taxes="record?.taxes ?? []"
							:editable="order?.status == OrderStatus.PENDING_PAYMENT"
							@refresh="onItemsRefresh"
						/>
					</UCard>

					<!-- Remarks Section -->
					<UCard v-if="record?.remarks" class="remarks-card">
						<template #header>
							<div class="card-header">
								<h2 class="card-title">
									<UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-5 h-5" />
									{{ $t('components.orderDetail.remarks') }}
								</h2>
							</div>
						</template>
						<p class="remarks-text">{{ record?.remarks }}</p>
					</UCard>

					<FulfillmentCard
						:fulfillment="record?.fulfillment"
						:is-read-only="isSaleReadOnly"
						:loading="fulfillmentStore.creating || fulfillmentStore.updating"
						@action="handleFulfillmentAction"
					/>

					<ShipmentCard
						:shipment="record?.shipment"
						:is-read-only="isSaleReadOnly"
						:loading="shipmentStore.creating || shipmentStore.updating || shipmentStore.removing"
						@create="openCreateShipmentModal"
						@edit="openEditShipmentModal"
						@delete="handleDeleteShipment"
						@mark-delivered="handleMarkDelivered"
					/>

					<Activities :activities="record?.activities" />
				</div>

				<!-- Sidebar -->
				<div v-if="record !== undefined" class="side-wrapper">
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
									<UButton v-if="record.payments?.length == 0" variant="ghost" size="xs" :icon="ICONS.ADD_OUTLINE" @click="addPaymentInfo" />
									<div v-if="record?.payment_status === PaymentStatus.PAID" class="status-group">
										<UBadge color="success" size="lg">
											<UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
											{{ $t('components.orderDetail.paid') }}
										</UBadge>
									</div>
								</div>
							</template>

							<div v-if="record.payments && record.payments.length > 0" class="payments-list">
								<div v-for="payment in record.payments" :key="payment.payment_line" class="payment-item" @click="viewPaymentInfo(payment)">
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
								<UButton size="sm" color="primary" :icon="ICONS.ADD_OUTLINE" @click="addPaymentInfo">
									{{ $t('components.orderDetail.addPayment') }}
								</UButton>
							</div>
						</UCard>
					</div>
				</div>
			</div>
		</div>

		<CreateShipmentModal
			:open="isCreateShipmentModalOpen"
			:methods="shipmentModalMethods"
			:loading="shipmentStore.creating || shipmentStore.updating"
			:title="shipmentModalTitle"
			:submit-label="shipmentModalSubmitLabel"
			:initial-value="shipmentModalInitialValue"
			@update:open="isCreateShipmentModalOpen = $event"
			@submit="handleShipmentSubmit"
		/>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalOrderDetailCustomer, ZModalOrderDetailPayment } from '#components';
import { OrderStatus, PaymentStatus, getFormattedDate } from 'wemotoo-common';
import { failedNotification, successNotification } from '~/stores/AppUi/AppUi';
import type { PaymentModel } from '~/utils/models';
import { ICONS } from '~/utils/icons';
import type { OrderHistory } from '~/utils/types/order-history';
import FulfillmentCard from '~/components/Fulfillment/FulfillmentCard.vue';
import ShipmentCard from '~/components/Shipment/ShipmentCard.vue';
import CreateShipmentModal from '~/components/Shipment/CreateShipmentModal.vue';
import Activities from '~/components/ActivityLog/Activities.vue';
import { useFulfillmentStore } from '~/stores/Fulfillment/Fulfillment';
import { useShipmentStore } from '~/stores/Shipment/Shipment';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';

const orderStore = useOrderStore();
const saleStore = useSaleStore();
const fulfillmentStore = useFulfillmentStore();
const shipmentStore = useShipmentStore();
const shippingStore = useShippingMethodStore();
const { updating } = storeToRefs(orderStore);

const loading = computed(() => orderStore.loading || saleStore.loading);

const route = useRoute();
const order_not_found = ref(false);
const order_no_param = computed(() => String(route.params.order_no ?? ''));
const type = computed(() => String(route.query.type ?? ''));
const isSaleReadOnly = computed(() => type.value === 'sale');

const order = ref<OrderHistory | undefined>();
const isCreateShipmentModalOpen = ref(false);
const shipmentModalMethods = ref<ShippingMethodOption[]>([]);
const shipmentModalMode = ref<'create' | 'update'>('create');
const shipmentModalInitialValue = ref<{
	shipping_method_id?: string;
	courier_name: string;
	tracking_no: string;
}>({
	shipping_method_id: undefined,
	courier_name: '',
	tracking_no: '',
});

const record = computed(() => order.value);

const orderForModal = computed((): OrderHistory | undefined => {
	return order.value;
});

const overlay = useOverlay();
const new_order_status = ref<OrderStatus>(OrderStatus.PENDING_PAYMENT);

const customer = computed(() => record.value?.customer);

const loadShipmentMethodsForModal = async () => {
	// const addr = customer.value?.shipping_address;
	// if (addr?.country_code) {
	// 	try {
	// 		shipmentModalMethods.value = await shippingStore.fetchAllShippingMethods({
	// 			country_code: addr.country_code,
	// 			state: addr.state,
	// 			postal_code: addr.postal_code,
	// 		});
	// 	} catch {
	// 		shipmentModalMethods.value = await shippingStore.fetchAllShippingMethods();
	// 	}
	// } else {
	// 	shipmentModalMethods.value = await shippingStore.fetchAllShippingMethods();
	// }
};

const items = computed(() => record.value?.items);
const currency_code = computed(() => record.value?.currency.code);

const REFRESH_COOLDOWN_SECONDS = 5;
const refresh_cooldown = ref(0);
const is_refreshing = ref(false);
let cooldown_interval: NodeJS.Timeout | null = null;

const isMobile = ref(false);

const checkMobile = () => {
	isMobile.value = window.innerWidth < 640;
};

watch(
	() => order.value?.status,
	(newStatus) => {
		if (newStatus) {
			new_order_status.value = newStatus as OrderStatus;
		}
	},
);

const { t } = useI18n();
useHead({ title: () => t('pages.orderDetailTitle') + (record.value?.order_no ?? '') });

const shipmentModalTitle = computed(() =>
	shipmentModalMode.value === 'create' ? t('components.shipment.createShipment') : t('components.shipment.updateShipment'),
);

const shipmentModalSubmitLabel = computed(() => (shipmentModalMode.value === 'create' ? t('common.create') : t('common.save')));

onMounted(() => {
	checkMobile();
	window.addEventListener('resize', checkMobile);
	getOrderDetails();
});

onBeforeRouteLeave(() => {
	order.value = undefined;
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

const getOrderDetails = async () => {
	try {
		if (type.value === 'order') {
			const data = await orderStore.getOrderByOrderNo(order_no_param.value);
			order.value = data;
		} else {
			const data = await saleStore.getBillDetailByOrderNo(order_no_param.value);
			order.value = data;
		}
	} catch {
		order_not_found.value = true;
	}
};

const onItemsRefresh = () => {
	return getOrderDetails();
};

const handleFulfillmentAction = async (action: 'processing' | 'packed' | 'fulfilled') => {
	if (!record.value?.order_no || isSaleReadOnly.value) {
		return;
	}

	if (action === 'processing') {
		await fulfillmentStore.markProcessing(record.value.order_no);
	} else if (action === 'packed') {
		await fulfillmentStore.markPacked(record.value.order_no);
	} else {
		await fulfillmentStore.markFulfilled(record.value.order_no);
	}

	await getOrderDetails();
};

const openCreateShipmentModal = async () => {
	if (isSaleReadOnly.value) {
		return;
	}

	shipmentModalMode.value = 'create';
	shipmentModalInitialValue.value = {
		shipping_method_id: undefined,
		courier_name: '',
		tracking_no: '',
	};
	await loadShipmentMethodsForModal();
	isCreateShipmentModalOpen.value = true;
};

const openEditShipmentModal = async () => {
	if (!record.value?.shipment || isSaleReadOnly.value) {
		return;
	}

	shipmentModalMode.value = 'update';
	shipmentModalInitialValue.value = {
		shipping_method_id: undefined,
		courier_name: record.value.shipment.courier_name,
		tracking_no: record.value.shipment.tracking_no,
	};
	await loadShipmentMethodsForModal();
	isCreateShipmentModalOpen.value = true;
};

const handleShipmentSubmit = async (payload: { shipping_method_id?: string; courier_name: string; tracking_no: string }) => {
	if (!record.value || isSaleReadOnly.value) {
		return;
	}

	if (shipmentModalMode.value === 'create' && !payload.shipping_method_id) {
		failedNotification(t('components.shipment.shippingMethod') + ' ' + t('common.required'));
		return;
	}

	if (shipmentModalMode.value === 'create') {
		await shipmentStore.createShipment({
			order_no: record.value.order_no,
			inv_no: record.value.inv_no,
			shipping_method_id: payload.shipping_method_id!,
			courier_name: payload.courier_name,
			tracking_no: payload.tracking_no,
		});
	} else if (record.value.shipment?.id) {
		await shipmentStore.updateShipment(record.value.shipment.id, {
			shipping_method_id: payload.shipping_method_id,
			courier_name: payload.courier_name,
			tracking_no: payload.tracking_no,
		});
	}

	isCreateShipmentModalOpen.value = false;
	await getOrderDetails();
};

const handleDeleteShipment = async () => {
	if (!record.value?.shipment?.id || isSaleReadOnly.value) {
		return;
	}

	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: t('components.shipment.confirmDelete'),
			action: 'delete',
			onConfirm: async () => {
				await shipmentStore.deleteShipment(record.value!.shipment!.id);
				confirmModal.close();
				await getOrderDetails();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const handleMarkDelivered = async () => {
	if (!record.value?.shipment?.id || isSaleReadOnly.value) {
		return;
	}

	await shipmentStore.markDelivered(record.value.shipment.id);
	await getOrderDetails();
};

const refreshOrder = async () => {
	if (is_refreshing.value || refresh_cooldown.value > 0) {
		return;
	}

	if (!record.value?.order_no) return;

	is_refreshing.value = true;

	try {
		await getOrderDetails();
		successNotification(t('components.orderDetail.refreshSuccess'));

		refresh_cooldown.value = REFRESH_COOLDOWN_SECONDS;

		if (cooldown_interval) {
			clearInterval(cooldown_interval);
		}

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
		console.error('Failed to refresh:', error);
	} finally {
		is_refreshing.value = false;
	}
};

const refresh_button_text = computed(() => {
	if (isMobile.value) {
		return '';
	}

	if (refresh_cooldown.value > 0) {
		return t('components.orderDetail.waitSeconds', { n: refresh_cooldown.value });
	}
	return t('components.orderDetail.refresh');
});

const handleUpdateOrderStatus = async () => {
	await updateOrderStatus(new_order_status.value);
};

const executeOrderStatusUpdate = async (new_status: OrderStatus) => {
	if (!order.value) {
		throw new Error('Order not found');
	}

	if (new_status == OrderStatus.COMPLETED && order.value.payment_status == PaymentStatus.PENDING) {
		failedNotification(t('components.orderDetail.paymentInfoRequired'));
		return;
	}

	try {
		const shouldStay = await orderStore.updateStatus(order.value.order_no, order.value.customer.customer_no, new_status, type.value);
		if (shouldStay) {
			await getOrderDetails();
			successNotification(t('components.orderDetail.statusUpdateSuccess'));
		} else {
			useRouter().back();
		}
	} catch {
		failedNotification(t('components.orderDetail.error'));
	}
};

const updateOrderStatus = async (new_status: OrderStatus) => {
	if (!order.value) {
		throw new Error('Order not found');
	}

	if (new_status == OrderStatus.CANCELLED) {
		const confirmModal = overlay.create(ZModalConfirmation, {
			props: {
				message: t('components.orderDetail.confirmCancelOrder'),
				titleVariant: 'danger',
				action: 'delete',
				onConfirm: async () => {
					await executeOrderStatusUpdate(new_status);
					confirmModal.close();
				},
				onCancel: () => {
					confirmModal.close();
				},
			},
		});
		confirmModal.open();
		return;
	}

	await executeOrderStatusUpdate(new_status);
};

const editCustomerDetail = async () => {
	if (!customer.value || !record.value) return;

	const customerModal = overlay.create(ZModalOrderDetailCustomer, {
		props: {
			orderNo: record.value.order_no,
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

const addPaymentInfo = () => {
	if (!orderForModal.value) return;

	const paymentModal = overlay.create(ZModalOrderDetailPayment, {
		props: {
			order: orderForModal.value,
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
	if (!orderForModal.value) return;

	const paymentModal = overlay.create(ZModalOrderDetailPayment, {
		props: {
			order: orderForModal.value,
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
.order-detail-container {
	max-width: 1600px;
}

.order-not-found {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem 1.5rem;
	text-align: center;
	gap: 1rem;
}

.order-not-found-icon {
	width: 3rem;
	height: 3rem;
	color: var(--color-gray-400);
}

.order-not-found-text {
	color: var(--color-gray-600);
	font-size: 1rem;
	max-width: 28rem;
}

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

.status-badge-stack {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.375rem;
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

.status-last-updated {
	margin: 0;
	max-width: min(100%, 18rem);
	text-align: right;
	font-size: 0.6875rem;
	line-height: 1.25;
	font-variant-numeric: tabular-nums;
	color: var(--ui-text-muted, var(--color-gray-500));
	opacity: 0.75;
}

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
