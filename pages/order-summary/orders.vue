<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterOrderSumm />
			<UCard class="mt-4">
				<UTable :rows="rows" :columns="order_summ_columns" :loading="is_loading">
					<template #biz_date-data="{ row }">
						<p class="font-bold">{{ row.biz_date }}</p>
					</template>

					<template #currency_code-data="{ row }">
						<p class="font-bold">{{ row.currency_code }}</p>
					</template>

					<template #order_status-data="{ row }">
						<p v-if="row.order_status == OrderStatus.COMPLETED" class="font-bold text-green-500">COMPLETED</p>
						<p v-else-if="row.order_status == OrderStatus.PENDING_PAYMENT" class="font-bold text-main">PAYMENT REQUIRED</p>
						<p v-else-if="row.order_status == OrderStatus.REFUNDED" class="font-bold text-red-500">REFUNDED</p>
						<p v-else-if="row.order_status == OrderStatus.CANCELLED" class="font-bold text-neutral-500">CANCELLED</p>
						<p v-else class="font-bold">-</p>
					</template>

					<template #gross_amt-data="{ row }">
						<p class="font-bold">{{ row.gross_amt }}</p>
					</template>

					<template #net_amt-data="{ row }">
						<p class="font-bold">{{ row.net_amt }}</p>
					</template>

					<template #total_orders-data="{ row }">
						<p class="font-bold">{{ row.total_orders }}</p>
					</template>

					<template #total_qty-data="{ row }">
						<p class="font-bold">{{ row.total_qty }}</p>
					</template>

					<template #total_voided_qty-data="{ row }">
						<p class="font-bold">{{ row.total_voided_qty }}</p>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Data !</span>
						</div>
					</template>
				</UTable>

				<div v-if="data.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="data.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { OrderStatus } from 'wemotoo-common';
import { order_summ_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Order Summary',
		icon: ICONS.LIST,
		to: '/order-summary/orders',
	},
];

const page = ref(1);
const pageSize = ref(10);
const orderSummStore = useSummOrderStore();
const { order_summ } = storeToRefs(orderSummStore);

const is_loading = computed(() => order_summ.value.is_loading);
const data = computed(() => order_summ.value.data);

const rows = computed(() => {
	return data.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="postcss"></style>
