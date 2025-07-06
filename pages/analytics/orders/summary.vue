<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
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

					<template #status-data="{ row }">
						<UBadge v-if="row.status == OrderStatus.NEW" variant="outline" color="green">NEW</UBadge>
						<UBadge v-else-if="row.status == OrderStatus.REFUNDED" variant="outline" color="main">REFUNDED</UBadge>
						<UBadge v-else-if="row.status == OrderStatus.CANCELLED" variant="outline" color="red">CANCELLED</UBadge>
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
					<UPagination v-model="current_page" :page-count="order_summ.page_size" :total="order_summ.total_data" @update:model-value="updatePage" />
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
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Order Summary',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/summary',
	},
];

onMounted(async () => {
	await orderSummStore.getOrderSummary();
});

const orderSummStore = useSummOrderStore();
const { order_summ } = storeToRefs(orderSummStore);
const current_page = computed(() => order_summ.value.current_page);

const currency_code = ref(order_summ.value.filter.currency_code);

const is_loading = computed(() => order_summ.value.is_loading);
const data = computed(() => order_summ.value.data);
const selectedColumns = ref(order_summ_columns);
const columnsTable = computed(() => order_summ_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: { key: string; label: string }[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return data.value.slice((current_page.value - 1) * order_summ.value.page_size, current_page.value * order_summ.value.page_size);
});

const updatePage = async (page: number) => {
	order_summ.value.current_page = page;
	await orderSummStore.getOrderSummary();
};
</script>

<style scoped lang="postcss"></style>
