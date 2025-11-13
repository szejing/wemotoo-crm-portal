<template>
	<UDashboardPanel id="orders-detail">
		<template #header>
			<UDashboardNavbar title="Order Detail" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZLoading v-if="is_loading" />
			<div v-else class="wrapper-grid">
				<div class="main-wrapper">
					<div class="flex-jbetween-icenter w-full mt-4">
						<div>
							<h2 class="font-light">Order #{{ order?.order_no }}</h2>
							<h2 v-if="order?.order_date_time">Date Time: {{ getFormattedDate(order?.order_date_time, 'dd MMM yyyy HH:mm') }}</h2>
						</div>
						<div>
							<UBadge v-if="order?.status === OrderStatus.PENDING_PAYMENT" variant="subtle" color="info">PENDING PAYMENT</UBadge>
							<UBadge v-else-if="order?.status === OrderStatus.PROCESSING" color="info">PROCESSING</UBadge>
							<UBadge v-else-if="order?.status === OrderStatus.COMPLETED" color="success">COMPLETED</UBadge>
							<UBadge v-else-if="order?.status === OrderStatus.REQUIRES_ACTION" color="warning">REQUIRES ACTION</UBadge>
							<UBadge v-else-if="order?.status === OrderStatus.REFUNDED" color="error">REFUNDED</UBadge>
							<UBadge v-else-if="order?.status === OrderStatus.CANCELLED" color="error">CANCELLED</UBadge>
						</div>
					</div>
					<div class="flex flex-col gap-4 w-full mt-4">
						<!-- Customer Detail -->
						<UCard>
							<template #header>
								<div class="flex-between">
									<h2 class="text-main">Customer</h2>
									<UButton variant="ghost" class="flex-none" square :icon="ICONS.VERTICAL_ELLIPSIS" size="sm" @click="editCustomerDetail" />
								</div>
							</template>
							<ZSectionOrderDetailCustomer :customer="customer" />
						</UCard>

						<!-- Order Detail -->
						<UCard>
							<template #header>
								<div class="flex-between">
									<h2 class="text-main">Items</h2>
									<UPopover v-if="order?.status !== OrderStatus.PENDING_PAYMENT" overlay>
										<UButton color="neutral" :trailing-icon="ICONS.QUESTION_MARK" variant="soft" size="xs" />

										<template #content>
											<div class="p-4">
												<p>
													This order is no longer editable.<br />
													Please switch <b class="text-main">Order Status</b> to <b class="text-main">Pending Payment</b> if you want to edit this order.
												</p>
											</div>
										</template>
									</UPopover>
								</div>
							</template>

							<ZSectionOrderDetailItems
								:items="items ?? []"
								:currency-code="currency_code"
								:total-gross-amt="order?.gross_amt"
								:total-net-amt="order?.net_total"
								:taxes="order?.taxes ?? []"
								:editable="order?.status == OrderStatus.PENDING_PAYMENT"
								@refresh="getOrder(order?.order_no as string)"
							/>
						</UCard>
					</div>
				</div>
				<div v-if="order !== undefined" class="side-wrapper">
					<ZInputOrderSidebar
						:update-order-status="
							async (status: OrderStatus) => {
								await updateOrderStatus(status);
							}
						"
						:order="order"
						:update-payment-status="
							async (status: PaymentStatus) => {
								await updatePaymentStatus(status);
							}
						"
						:add-payment-info="addPaymentInfo"
						:view-payment-info="viewPaymentInfo"
					/>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalOrderDetailCustomer, ZModalOrderDetailPayment } from '#components';
import { OrderStatus, PaymentStatus, getFormattedDate } from 'wemotoo-common';
import { failedModal } from '~/stores/AppUi/AppUi';
import type { PaymentModel } from '~/utils/models';

const orderStore = useOrderStore();
const is_loading = ref(true);
const { detail } = storeToRefs(orderStore);

const overlay = useOverlay();
const order = computed(() => detail.value);

useHead({ title: 'Wemotoo CRM - Order Detail #' + order.value?.order_no });

onMounted(async () => {
	const route = useRoute();
	const order_no = route.params.order_no;
	await getOrder(order_no as string);
});

onBeforeRouteLeave(() => {
	orderStore.setDetail(undefined);
});

const customer = computed(() => order.value?.customer);
const items = computed(() => order.value?.items);
const currency_code = computed(() => order.value?.currency.code);

const getOrder = async (order_no: string) => {
	is_loading.value = true;

	try {
		await orderStore.getOrderByOrderNo(order_no as string);
	} catch {
		return navigateTo('/orders');
	} finally {
		is_loading.value = false;
	}
};

/* Update Order Status		*/
const updateOrderStatus = async (new_status: OrderStatus) => {
	if (!order.value) {
		throw new Error('Order not found');
	}

	const { order_no, customer } = order.value;

	if (!customer) {
		throw new Error('Customer not found');
	}

	if (new_status == OrderStatus.CANCELLED) {
		failedModal('Are you sure you want to cancel this order?');
		return;
	}

	if (new_status == OrderStatus.COMPLETED && order.value.payment_status == PaymentStatus.PENDING) {
		failedModal('Please fill in the payment information before completing the order.', 'Payment Info Required');
		return;
	}

	is_loading.value = true;
	await orderStore.updateOrderStatus(order_no, customer.customer_no, new_status);
	is_loading.value = false;
};

/* Update Payment Status */
const updatePaymentStatus = async (new_status: PaymentStatus) => {
	if (!order.value) {
		throw new Error('Order not found');
	}

	const { order_no, customer } = order.value;

	if (!customer) {
		throw new Error('Customer not found');
	}

	if (new_status == PaymentStatus.PAID && order.value.payments?.length == 0) {
		failedModal('Please fill in the payment information before completing the order.', 'Payment Info Required');
		return;
	}

	is_loading.value = true;
	await orderStore.updateOrder(order_no, customer.customer_no, new_status);
	is_loading.value = false;
};

/* Edit Customer Detail */
const editCustomerDetail = async () => {
	if (!customer.value) return;

	const customerModal = overlay.create(ZModalOrderDetailCustomer, {
		props: {
			customer: JSON.parse(JSON.stringify(customer.value)),
			onUpdate: () => {
				customerModal.close();
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
			},
			onCancel: () => {
				// paymentModal.close();
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
.wrapper-grid {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1rem;
}

@media (min-width: 640px) {
	.wrapper-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.main-wrapper {
	grid-column: span 1 / span 1;
}

@media (min-width: 640px) {
	.main-wrapper {
		grid-column: span 3 / span 3;
	}
}

.side-wrapper {
	display: none;
	grid-column: span 1 / span 1;
}

@media (min-width: 640px) {
	.side-wrapper {
		display: block;
	}
}

.section-empty {
	height: 13rem;
}

.section-empty div {
	text-align: center;
}

.section-empty h2 {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 600;
}

.section-empty p {
	color: var(--color-neutral-400);
}
</style>
