<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterOrderSummItems />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<ZSelectMenuTableColumns :columns="order_summ_item_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</template>

				<UTable :rows="tableData" :columns="order_summ_item_header_columns" :loading="is_loading" :expand="expandedRows" @update:expand="expandedRows = $event">
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
							<UTable :rows="row.items" :columns="columnsTable">
								<template #prod_code-data="{ row: item }">
									<p>{{ item.prod_code }} - {{ item.prod_name }}</p>
								</template>

								<template #status-data="{ row: item }">
									<UBadge v-if="item.status == OrderStatus.NEW" variant="outline" color="green">NEW</UBadge>
									<UBadge v-else-if="item.status == OrderStatus.REFUNDED" variant="outline" color="main">REFUNDED</UBadge>
									<UBadge v-else-if="item.status == OrderStatus.CANCELLED" variant="outline" color="red">CANCELLED</UBadge>
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
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { OrderStatus, OrderItemStatus, getFormattedDate } from 'wemotoo-common';
import { order_summ_item_columns, order_summ_item_header_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Order Item Summary',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/items',
	},
];

const orderSummStore = useSummOrderStore();
const { order_summ_item } = storeToRefs(orderSummStore);
const currency_code = ref(order_summ_item.value.filter.currency_code);

const is_loading = computed(() => order_summ_item.value.is_loading);
const data = computed(() => order_summ_item.value.data);

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

const selectedColumns = ref(order_summ_item_columns);
const columnsTable = computed(() => order_summ_item_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: { key: string; label: string }[]) => {
	selectedColumns.value = columns;
};
</script>

<style scoped lang="postcss">
:deep(.u-table-expand) {
	@apply bg-gray-50;
}
</style>
