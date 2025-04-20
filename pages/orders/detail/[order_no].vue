<template>
	<div>
		<h1>Detail</h1>
		<div class="wrapper-grid">
			<div class="main-wrapper">
				<div class="flex-between w-full mt-4">
					<div>
						<h2>#{{ order?.order_no }}</h2>
						<h2 v-if="order?.biz_date">Date: {{ order?.biz_date }}</h2>
					</div>
					<div>
						<UBadge v-if="order?.order_status == OrderStatus.NEW" color="green" size="lg">NEW</UBadge>
						<UBadge v-else-if="order?.order_status == OrderStatus.PENDING_PAYMENT" color="main" size="lg">PAYMENT REQUIRED</UBadge>
						<UBadge v-else-if="order?.order_status == OrderStatus.REFUNDED" color="red" size="lg">REFUNDED</UBadge>
						<UBadge v-else-if="order?.order_status == OrderStatus.CANCELLED" color="gray" size="lg">CANCELLED</UBadge>
					</div>
				</div>
				<div class="flex flex-col gap-4 w-full mt-4">
					<!-- Customer Detail -->
					<UCard>
						<template #header>
							<h2 class="">Customer Detail</h2>
							<div class="flex flex-col gap-1 mt-2">
								<p v-if="customer?.customer_no" class="customer-detail-item">
									<span>Cust No :</span>
									<span>{{ customer?.customer_no }}</span>
								</p>
								<p v-if="customer?.user_id" class="customer-detail-item">
									<span>User Id :</span>
									<span>{{ customer?.user_id }}</span>
								</p>
								<p v-if="customer?.email_address" class="customer-detail-item">
									<span>Email Address :</span>
									<span>{{ customer?.email_address }}</span>
								</p>
								<p v-if="customer?.phone_no" class="customer-detail-item">
									<span>Phone No. :</span>
									<span>{{ customer?.phone_no }}</span>
								</p>
								<p v-if="customer?.ref_no1" class="customer-detail-item">
									<span>Ref No 1 :</span>
									<span>{{ customer?.ref_no1 }}</span>
								</p>
								<p v-if="customer?.ref_no2" class="customer-detail-item">
									<span>Ref No 2 :</span>
									<span>{{ customer?.ref_no2 }}</span>
								</p>
							</div>
						</template>

						<div class="grid sm:grid-cols-2 gap-4">
							<div class="flex flex-col gap-4">
								<h3>Shipping Address :</h3>
								<p v-if="customer?.s_address1">{{ customer?.s_address1 }}</p>
								<p v-if="customer?.s_address2">{{ customer?.s_address2 }}</p>
								<p v-if="customer?.s_address3">{{ customer?.s_address3 }}</p>
								<p v-if="customer?.s_city">{{ customer?.s_city }}</p>
								<p v-if="customer?.s_state">{{ customer?.s_state }}</p>
								<p v-if="customer?.s_postal_code">{{ customer?.s_postal_code }}</p>
							</div>

							<div class="flex flex-col gap-4">
								<h3>Billing Address :</h3>
								<p v-if="customer?.b_address1">{{ customer?.b_address1 }}</p>
								<p v-if="customer?.b_address2">{{ customer?.b_address2 }}</p>
								<p v-if="customer?.b_address3">{{ customer?.b_address3 }}</p>
								<p v-if="customer?.b_city">{{ customer?.b_city }}</p>
								<p v-if="customer?.b_state">{{ customer?.b_state }}</p>
								<p v-if="customer?.b_postal_code">{{ customer?.b_postal_code }}</p>
							</div>
						</div>
					</UCard>

					<!-- Order Detail -->
					<UCard>
						<template #header>
							<h2>Order Detail</h2>
						</template>

						<table class="w-full">
							<thead>
								<tr class="border-b">
									<th class="cell-header">Code</th>
									<th class="cell-header">Item Status</th>
									<th class="cell-header">Qty</th>
									<th class="cell-header">Gross Amt ({{ currency_code }})</th>
									<th class="cell-header">Net Amt ({{ currency_code }})</th>
									<th class="cell-header">Total Amt ({{ currency_code }})</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in items" :key="item.prod_code" class="border-b">
									<td class="cell">
										<span class="font-medium" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.prod_code }}</span>
										<br />
										<span
											class="text-xs"
											:class="{
												'italic text-neutral-300': item.status == OrderItemStatus.VOIDED,
												'text-neutral-500': item.status == OrderItemStatus.ACTIVE,
											}"
										>
											{{ item.prod_name.substring(0, 10) }}
										</span>
									</td>
									<td class="cell">
										<UBadge v-if="item.status == OrderItemStatus.ACTIVE" variant="outline" color="green">ACTIVE</UBadge>
										<UBadge v-else-if="item.status == OrderItemStatus.REFUNDED" variant="outline" color="red">REFUNDED</UBadge>
										<UBadge v-else-if="item.status == OrderItemStatus.VOIDED" variant="outline" color="red">VOIDED</UBadge>
									</td>
									<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.order_qty }}</td>
									<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.gross_amt.toFixed(2) }}</td>
									<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.net_amt.toFixed(2) }}</td>
									<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
										{{ item.status == OrderItemStatus.ACTIVE ? (item.net_amt * item.order_qty).toFixed(2) : 0 }}
									</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td colspan="4"></td>
									<td class="cell-header text-right border-b">Sub Total ({{ currency_code }})</td>
									<td class="cell font-bold text-lg italic border-b">{{ order?.gross_amt.toFixed(2) }}</td>
								</tr>
								<tr>
									<td colspan="4"></td>
									<td class="cell-header text-right border-b-4 border-double">Total ({{ currency_code }})</td>
									<td class="cell font-bold text-lg italic border-b-4 border-double">{{ order?.net_amt.toFixed(2) }}</td>
								</tr>
							</tfoot>
						</table>
					</UCard>

					<!-- Payment Items -->
					<UCard>
						<template #header>
							<h2>Payment Detail</h2>
						</template>
					</UCard>
				</div>
			</div>
			<div v-if="order !== undefined" class="side-wrapper">
				<ZInputOrderSidebar />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { OrderStatus, OrderItemStatus } from 'wemotoo-common';

const orderStore = useOrderStore();
const is_loading = ref(false);

const order = ref();

onMounted(async () => {
	const route = useRoute();
	const order_no = route.params.order_no;
	is_loading.value = true;

	try {
		order.value = await orderStore.getOrderByOrderNo(order_no as string);
		orderStore.setDetail(order.value);
	} catch {
		return navigateTo('/orders');
	} finally {
		is_loading.value = false;
	}
});

const customer = computed(() => order.value?.customer);
const items = computed(() => order.value?.items);
const currency_code = computed(() => order.value?.currency_code);
</script>

<style scoped lang="postcss">
.customer-detail-item {
	@apply flex flex-col sm:flex-row text-sm;
}

.customer-detail-item span:first-child {
	@apply w-full sm:w-[100px] lg:w-[120px] text-neutral-400;
}

.customer-detail-item span:last-child {
	@apply font-medium text-neutral-800;
}

.order-detail-item {
	@apply flex flex-col sm:flex-row;
}

.order-detail-item span:first-child {
	@apply w-full sm:w-[200px] lg:w-[240px] text-neutral-400;
}

.order-detail-item span:last-child {
	@apply font-medium text-neutral-800;
}

.cell-header {
	@apply p-4 text-gray-400 font-normal italic;
}

.cell {
	@apply p-4 text-center;
}

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
