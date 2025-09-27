<template>
	<div>
		<ZLoading v-if="is_loading" />

		<div v-else class="wrapper-grid">
			<div class="main-wrapper">
				<div class="flex-jbetween-icenter w-full mt-4">
					<div>
						<h2 class="font-light">Order #{{ order?.order_no }}</h2>
						<h2 v-if="order?.order_date_time">Date Time: {{ getFormattedDate(order?.order_date_time, 'dd MMM yyyy HH:mm') }}</h2>
					</div>
					<div>
						<UBadge v-if="order?.status == OrderStatus.NEW" color="green" variant="outline" size="lg">NEW</UBadge>
						<UBadge v-else-if="order?.status == OrderStatus.CANCELLED" color="red" variant="outline" size="lg">CANCELLED</UBadge>
						<UBadge v-else-if="order?.status == OrderStatus.COMPLETED" color="main" variant="outline" size="lg">COMPLETED</UBadge>
						<UBadge v-else-if="order?.status == OrderStatus.REFUNDED" color="gray" variant="outline" size="lg">REFUNDED</UBadge>
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
								<UPopover v-if="order?.status != OrderStatus.NEW" overlay>
									<UButton color="gray" :trailing-icon="ICONS.QUESTION_MARK" variant="soft" size="xs" />

									<template #panel>
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
							:total-net-amt="order?.net_amt"
							:total-tax-amt="order?.tax_amt_exc"
							:editable="order?.status == OrderStatus.NEW"
							@refresh="getOrder(order?.order_no as string)"
						/>
					</UCard>
				</div>
			</div>
			<div v-if="order !== undefined" class="side-wrapper">
				<ZInputOrderSidebar
					:order="order"
					:update-order-status="async (status: OrderStatus) => { await updateOrderStatus(status); }"
					:update-payment-status="async (status: PaymentStatus) => { await updatePaymentStatus(status); }"
					:add-payment-info="addPaymentInfo"
					:view-payment-info="viewPaymentInfo"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalOrderDetailCustomer, ZModalOrderDetailPayment } from '#components';
import { OrderStatus, PaymentStatus, getFormattedDate } from 'wemotoo-common';
import { failedModal } from '~/stores/AppUi/AppUi';
import type { PaymentModel } from '~/utils/models';

const orderStore = useOrderStore();
const is_loading = ref(true);
const { detail } = storeToRefs(orderStore);

const modal = useModal();
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
const currency_code = computed(() => order.value?.currency_code);

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

	if (new_status == PaymentStatus.SUCCESS && order.value.payments?.length == 0) {
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

	modal.open(ZModalOrderDetailCustomer, {
		customer: JSON.parse(JSON.stringify(customer.value)),
		onUpdate: () => {
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

/* Add Payment Info */
const addPaymentInfo = () => {
	modal.open(ZModalOrderDetailPayment, {
		onUpdate: () => {
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const viewPaymentInfo = (payment: PaymentModel) => {
	modal.open(ZModalOrderDetailPayment, {
		payment: payment,
		onUpdate: () => {
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};
</script>

<style scoped lang="postcss">
.wrapper-grid {
	@apply grid grid-cols-1 sm:grid-cols-4 gap-4;
}

.main-wrapper {
	@apply col-span-1 sm:col-span-3;
}

.side-wrapper {
	@apply hidden sm:block col-span-1;
}

.section-empty {
	@apply h-52;
}

.section-empty div {
	@apply text-center;
}

.section-empty h2 {
	@apply text-2xl font-semibold;
}

.section-empty p {
	@apply text-gray-400;
}
</style>
