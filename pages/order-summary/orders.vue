<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterOrderSumm />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<ZSelectMenuTableColumns :columns="order_summ_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</template>

				<UTable :rows="rows" :columns="columnsTable" :loading="is_loading">
					<template #biz_date-data="{ row }">
						<p>{{ getFormattedDate(new Date(row.biz_date)) }}</p>
					</template>

					<template #currency_code-data="{ row }">
						<p>{{ row.currency_code }}</p>
					</template>

					<template #order_status-data="{ row }">
						<UBadge v-if="row.order_status == OrderStatus.NEW" variant="outline" color="green">NEW</UBadge>
						<UBadge v-else-if="row.order_status == OrderStatus.PENDING_PAYMENT" variant="outline" color="main">PAYMENT REQUIRED</UBadge>
						<UBadge v-else-if="row.order_status == OrderStatus.REFUNDED" variant="outline" color="red">REFUNDED</UBadge>
						<UBadge v-else-if="row.order_status == OrderStatus.CANCELLED" variant="outline" color="gray">CANCELLED</UBadge>
					</template>

					<template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #gross_amt-data="{ row }">
						<p>{{ row.gross_amt.toFixed(2) }}</p>
					</template>

					<template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #net_amt-data="{ row }">
						<p>{{ row.net_amt.toFixed(2) }}</p>
					</template>

					<template #total_orders-data="{ row }">
						<p>{{ row.total_orders }}</p>
					</template>

					<template #total_qty-data="{ row }">
						<p>{{ row.total_qty }}</p>
					</template>

					<template #total_voided_qty-data="{ row }">
						<p>{{ row.total_voided_qty }}</p>
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
import { OrderStatus, getFormattedDate } from 'wemotoo-common';
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

const currency_code = ref(order_summ.value.filter.currency_code);

const is_loading = computed(() => order_summ.value.is_loading);
const data = computed(() => order_summ.value.data);
const selectedColumns = ref(order_summ_columns);
const columnsTable = computed(() => order_summ_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: string[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return data.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="postcss"></style>
