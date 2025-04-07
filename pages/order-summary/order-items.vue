<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterOrderSummItems />
			<UCard class="mt-4">
				<UTable :rows="tableData" :columns="dateColumns" :loading="is_loading" :expand="expandedRows" @update:expand="expandedRows = $event">
					<template #biz_date-data="{ row }">
						<p class="font-bold">{{ extractDate(new Date(row.biz_date)) }}</p>
					</template>

					<template #total_orders-data="{ row }">
						<p class="font-bold">{{ row.total_orders }}</p>
					</template>

					<template #total_qty-data="{ row }">
						<p class="font-bold">{{ row.total_qty }}</p>
					</template>

					<template #gross_amt-data="{ row }">
						<p class="font-bold">{{ row.gross_amt }}</p>
					</template>

					<template #net_amt-data="{ row }">
						<p class="font-bold">{{ row.net_amt }}</p>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Data !</span>
						</div>
					</template>

					<template #expand="{ row }">
						<div class="p-4 bg-gray-50">
							<UTable :rows="row.items" :columns="order_item_summ_columns">
								<template #prod_code-data="{ row: item }">
									<p class="font-bold">{{ item.prod_code }} - {{ item.prod_name }}</p>
								</template>

								<template #order_status-data="{ row: item }">
									<p v-if="item.order_status == OrderStatus.COMPLETED" class="font-bold text-green-500">COMPLETED</p>
									<p v-else-if="item.order_status == OrderStatus.PENDING_PAYMENT" class="font-bold text-main">PAYMENT REQUIRED</p>
									<p v-else-if="item.order_status == OrderStatus.REFUNDED" class="font-bold text-red-500">REFUNDED</p>
									<p v-else-if="item.order_status == OrderStatus.CANCELLED" class="font-bold text-red-500">CANCELLED</p>
									<p v-else class="font-bold">-</p>
								</template>

								<template #item_status-data="{ row: item }">
									<p v-if="item.item_status == OrderItemStatus.ACTIVE" class="font-bold text-green-500">ACTIVE</p>
									<p v-else-if="item.item_status == OrderItemStatus.REFUNDED" class="font-bold text-red-500">REFUNDED</p>
									<p v-else-if="item.item_status == OrderItemStatus.VOIDED" class="font-bold text-red-500">VOIDED</p>
									<p v-else class="font-bold">-</p>
								</template>

								<template #gross_amt-data="{ row: item }">
									<p class="font-bold">{{ item.gross_amt }}</p>
								</template>

								<template #net_amt-data="{ row: item }">
									<p class="font-bold">{{ item.net_amt }}</p>
								</template>

								<template #total_orders-data="{ row: item }">
									<p class="font-bold">{{ item.total_orders }}</p>
								</template>

								<template #total_qty-data="{ row: item }">
									<p class="font-bold">{{ item.total_qty }}</p>
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
import { OrderStatus, OrderItemStatus, extractDate } from 'wemotoo-common';
import { order_item_summ_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Order Item Summary',
		icon: ICONS.LIST,
		to: '/summary/order-items',
	},
];

const dateColumns = [
	{
		key: 'biz_date',
		label: 'Business Date',
	},
	{
		key: 'total_orders',
		label: 'Total Orders',
	},
	{
		key: 'total_qty',
		label: 'Total Quantity',
	},
	{
		key: 'gross_amt',
		label: 'Gross Amount',
	},
	{
		key: 'net_amt',
		label: 'Net Amount',
	},
];

const orderSummStore = useSummOrderStore();
const { order_summ_item } = storeToRefs(orderSummStore);

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
</script>

<style scoped lang="postcss">
:deep(.u-table-expand) {
	@apply bg-gray-50;
}
</style>
