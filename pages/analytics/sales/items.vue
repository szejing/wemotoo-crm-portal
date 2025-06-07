<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSummItems />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<ZSelectMenuTableColumns :columns="sale_summ_item_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</template>

				<UTable :rows="tableData" :columns="sale_summ_item_header_columns" :loading="is_loading" :expand="expandedRows" @update:expand="expandedRows = $event">
					<template #biz_date-data="{ row }">
						<p class="font-bold">{{ getFormattedDate(new Date(row.biz_date)) }}</p>
					</template>

					<template #total_orders-data="{ row }">
						<p class="font-bold">{{ row.total_orders }}</p>
					</template>

					<template #total_qty-data="{ row }">
						<p class="font-bold">{{ row.total_qty }}</p>
					</template>

					<template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #gross_amt-data="{ row }">
						<p class="font-bold">{{ row.gross_amt.toFixed(2) }}</p>
					</template>

					<template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #net_amt-data="{ row }">
						<p class="font-bold">{{ row.net_amt.toFixed(2) }}</p>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Data !</span>
						</div>
					</template>

					<template #expand="{ row }">
						<div class="p-4 bg-gray-50">
							<UTable :rows="row.items" :columns="sale_summ_item_columns">
								<template #prod_code-data="{ row: item }">
									<p>{{ item.prod_code }} - {{ item.prod_name }}</p>
								</template>

								<template #item_status-data="{ row: item }">
									<UBadge v-if="item.item_status == OrderItemStatus.ACTIVE" variant="outline" color="green">ACTIVE</UBadge>
									<UBadge v-else-if="item.item_status == OrderItemStatus.REFUNDED" variant="outline" color="main">REFUNDED</UBadge>
									<UBadge v-else-if="item.item_status == OrderItemStatus.VOIDED" variant="outline" color="red">VOIDED</UBadge>
								</template>

								<template #gross_amt-header>
									<p>
										Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
									</p>
								</template>

								<template #gross_amt-data="{ row: item }">
									<p>{{ item.gross_amt.toFixed(2) }}</p>
								</template>

								<template #net_amt-header>
									<p>
										Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
									</p>
								</template>

								<template #net_amt-data="{ row: item }">
									<p>{{ item.net_amt.toFixed(2) }}</p>
								</template>

								<template #total_qty-data="{ row: item }">
									<p>{{ item.total_qty }}</p>
								</template>
							</UTable>
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
import { getFormattedDate, OrderItemStatus } from 'wemotoo-common';
import { sale_summ_item_columns, sale_summ_item_header_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Item Reports',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/items',
	},
];

const page = ref(1);
const pageSize = ref(10);
const salesSummStore = useSummSaleStore();
const { sale_summ_items } = storeToRefs(salesSummStore);

const currency_code = ref(sale_summ_items.value.filter.currency_code);

const is_loading = computed(() => sale_summ_items.value.is_loading);
const data = computed(() => sale_summ_items.value.data);

interface TableRow {
	biz_date: string;
	items: (typeof data.value)[0][];
	total_orders: number;
	total_qty: number;
	gross_amt: number;
	net_amt: number;
}

interface ExpandedState {
	openedRows: TableRow[];
	row: TableRow | null;
}

const expandedRows = ref<ExpandedState>({
	openedRows: [],
	row: null,
});

interface GroupedData {
	[key: string]: (typeof data.value)[0][];
}

const groupedData = computed<GroupedData>(() => {
	const grouped: GroupedData = {};
	data.value.forEach((item) => {
		const date = new Date(item.biz_date).toISOString().split('T')[0] as string;
		if (!grouped[date]) {
			grouped[date] = [];
		}
		grouped[date].push(item);
	});
	return grouped;
});

const tableData = computed(() => {
	return Object.entries(groupedData.value).map(([date, items]) => {
		const totals = items.reduce(
			(acc, item) => {
				acc.total_orders += item.total_orders;
				acc.total_qty += item.total_qty;
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;
				return acc;
			},
			{ total_orders: 0, total_qty: 0, gross_amt: 0, net_amt: 0 },
		);

		return {
			biz_date: date,
			items,
			...totals,
		};
	});
});

// Set default expanded rows when data changes
watch(
	tableData,
	(newData) => {
		if (newData.length > 0) {
			// Expand the first row by default
			expandedRows.value = {
				openedRows: [newData[0]],
				row: newData[0],
			};
		}
	},
	{ immediate: true },
);

const selectedColumns = ref(sale_summ_item_columns);

const updateColumns = (columns: { key: string; label: string }[]) => {
	selectedColumns.value = columns;
};
</script>

<style scoped lang="postcss"></style>
