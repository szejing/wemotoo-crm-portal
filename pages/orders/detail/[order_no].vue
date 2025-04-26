<template>
	<div>
		<ZLoading v-if="is_loading" />

		<div v-else class="wrapper-grid">
			<div class="main-wrapper">
				<div class="flex-jbetween-icenter w-full mt-4">
					<div>
						<h2 class="font-light">Order #{{ order?.order_no }}</h2>
						<h2 v-if="order?.biz_date">Date: {{ order?.biz_date }}</h2>
					</div>
					<div>
						<UBadge v-if="order?.order_status == OrderStatus.NEW" color="green" variant="outline" size="lg">NEW</UBadge>
						<UBadge v-else-if="order?.order_status == OrderStatus.PENDING_PAYMENT" color="main" variant="outline" size="lg">PAYMENT REQUIRED</UBadge>
						<UBadge v-else-if="order?.order_status == OrderStatus.REFUNDED" color="red" variant="outline" size="lg">REFUNDED</UBadge>
						<UBadge v-else-if="order?.order_status == OrderStatus.CANCELLED" color="gray" variant="outline" size="lg">CANCELLED</UBadge>
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
								<UPopover v-if="order?.order_status != OrderStatus.NEW && order?.order_status != OrderStatus.PENDING_PAYMENT" overlay>
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
							:editable="order?.order_status == OrderStatus.NEW || order?.order_status == OrderStatus.PENDING_PAYMENT"
							@refresh="getOrder(order?.order_no as string)"
						/>
					</UCard>

					<!-- Payment Items -->
					<!-- <UCard>
						<template #header>
							<div class="flex-between">
								<h2>Payment Detail</h2>
								<UButton variant="ghost" class="flex-none" square :icon="ICONS.VERTICAL_ELLIPSIS" size="sm" color="danger" />
							</div>
						</template>
						<ZSectionOrderDetailPayment :payment="payment" />
					</UCard> -->
				</div>
			</div>
			<div v-if="order !== undefined" class="side-wrapper">
				<ZInputOrderSidebar :order="order" :update-order-status="(status: string) => updateOrderStatus(status).then(() => {})" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalOrderDetailCustomer } from '#components';
import { OrderStatus } from 'wemotoo-common';

const orderStore = useOrderStore();
const is_loading = ref(true);
const { detail } = storeToRefs(orderStore);

const modal = useModal();
const order = computed(() => detail.value);

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

const updateOrderStatus = async (new_status: string) => {
	try {
		if (!order.value) {
			throw new Error('Order not found');
		}

		const { order_no, customer } = order.value;

		if (!customer) {
			throw new Error('Customer not found');
		}
		is_loading.value = true;

		await orderStore.updateOrderStatus(order_no, customer.customer_no, new_status);
	} catch {
		return navigateTo('/orders');
	} finally {
		is_loading.value = false;
	}
};

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
</style>
