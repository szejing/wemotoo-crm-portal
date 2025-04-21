<template>
	<div>
		<h1>Detail</h1>
		<ZLoading v-if="is_loading" />

		<div v-else class="wrapper-grid">
			<div class="main-wrapper">
				<div class="flex-between w-full mt-4">
					<div>
						<h2>#{{ order?.order_no }}</h2>
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
								<h2>Customer Detail</h2>
								<UButton variant="ghost" class="flex-none" square :icon="ICONS.VERTICAL_ELLIPSIS" size="sm" color="danger" @click="editCustomerDetail" />
							</div>
						</template>
						<ZSectionOrderDetailCustomer :customer="customer" />
					</UCard>

					<!-- Order Detail -->
					<UCard>
						<template #header>
							<div class="flex-between">
								<h2>Order Detail</h2>
								<UButton variant="ghost" class="flex-none" square :icon="ICONS.VERTICAL_ELLIPSIS" size="sm" color="danger" />
							</div>
						</template>
						<ZSectionOrderDetailItems :items="items" :currency-code="currency_code" :total-gross-amt="order.gross_amt" :total-net-amt="order.net_amt" />
					</UCard>

					<!-- Payment Items -->
					<UCard>
						<template #header>
							<div class="flex-between">
								<h2>Payment Detail</h2>
								<UButton variant="ghost" class="flex-none" square :icon="ICONS.VERTICAL_ELLIPSIS" size="sm" color="danger" />
							</div>
						</template>
						<ZSectionOrderDetailPayment :payment="payment" />
					</UCard>
				</div>
			</div>
			<div v-if="order !== undefined" class="side-wrapper">
				<ZInputOrderSidebar :order="order" :update-order-status="updateOrderStatus" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalOrderDetailCustomer } from '#components';
import { OrderStatus } from 'wemotoo-common';
import type { CustomerModel } from '~/utils/models/customer.model';

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
// const payment = computed(() => order.value?.payment);
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
	is_loading.value = true;

	const orderStore = useOrderStore();
	try {
		const { order_no, customer } = order.value;

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
		onUpdate: async (cust: CustomerModel) => {
			console.log(cust);
			// await tagsStore.updateTag(id, tag);
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
