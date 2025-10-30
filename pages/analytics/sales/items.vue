<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSummItems />

			<!-- Column Selector -->
			<!-- <div class="flex justify-end mb-4">
				<ZSelectMenuTableColumns :columns="sale_summ_item_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
			</div> -->

			<!-- Loading State -->
			<div v-if="is_loading" class="flex justify-center items-center py-12">
				<div class="text-neutral-500">Loading...</div>
			</div>

			<!-- Empty State -->
			<UCard v-else-if="groupedByDate.length === 0" class="mt-4">
				<div class="flex flex-col items-center justify-center py-12 gap-3">
					<Icon name="i-heroicons-inbox" class="text-neutral-400 text-4xl" />
					<span class="text-neutral-500">No sales data found</span>
				</div>
			</UCard>

			<!-- Grouped by Date -->
			<div v-else class="mt-4">
				<UCard class="overflow-hidden">
					<template #header>
						<UButton :disabled="sale_summ_items.exporting" :loading="sale_summ_items.exporting" @click="exportSalesItemsToCsv">
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>
					</template>

					<div v-for="(group, index) in groupedByDate" :key="group.date">
						<!-- Date Header -->
						<div
							class="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary px-6 py-4"
							:class="{ 'border-t border-neutral-200': index > 0 }"
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<h3 class="text-lg font-bold text-neutral-900">{{ getFormattedDate(new Date(group.date)) }}</h3>
									<div class="flex items-center gap-3 text-sm">
										<div class="flex items-center gap-1.5 text-neutral-600">
											<Icon name="i-heroicons-shopping-cart" class="text-base" />
											<span class="font-medium">{{ group.total_orders }} orders</span>
										</div>
										<div class="h-4 w-px bg-neutral-300"></div>
										<div class="flex items-center gap-1.5 text-green-600">
											<Icon name="i-heroicons-cube" class="text-base" />
											<span class="font-medium">{{ group.active_qty }} items</span>
										</div>
										<div v-if="group.voided_qty > 0" class="h-4 w-px bg-neutral-300"></div>
										<div v-if="group.voided_qty > 0" class="flex items-center gap-1.5 text-red-600">
											<Icon name="i-heroicons-x-circle" class="text-base" />
											<span class="font-medium">{{ group.voided_qty }} voided</span>
										</div>
									</div>
								</div>
								<div class="flex items-center gap-2 text-sm font-semibold text-primary">
									<span>Total: {{ group.net_amt.toFixed(2) }}</span>
								</div>
							</div>
						</div>

						<!-- Items Table -->
						<div class="px-6 pb-6 pt-4">
							<UTable
								:data="group.items"
								:columns="selectedColumns"
								:ui="{ tr: { base: '' }, table: 'table-fixed', divide: 'divide-y divide-gray-200', wrapper: 'relative overflow-auto' }"
							>
								<template #prod_code-data="{ row }">
									<div v-if="row.is_total_row" class="font-semibold text-neutral-700">{{ row.prod_name }}</div>
									<div v-else>
										<p class="font-medium text-neutral-900">{{ row.prod_name }}</p>
										<p class="text-xs text-neutral-500">{{ row.prod_code }}</p>
									</div>
								</template>

								<template #item_status-data="{ row }">
									<div class="flex justify-center">
										<span v-if="row.is_total_row"></span>
										<UBadge v-else-if="row.item_status == OrderItemStatus.ACTIVE" variant="soft" color="success" size="xs">Active</UBadge>
										<UBadge v-else-if="row.item_status == OrderItemStatus.REFUNDED" variant="soft" color="info" size="xs">Refunded</UBadge>
										<UBadge v-else-if="row.item_status == OrderItemStatus.VOIDED" variant="soft" color="error" size="xs">Voided</UBadge>
									</div>
								</template>

								<template #total_qty-data="{ row }">
									<p class="text-center" :class="row.is_total_row ? 'font-semibold text-neutral-900' : 'text-neutral-900'">{{ row.total_qty }}</p>
								</template>

								<template #gross_amt-data="{ row }">
									<p class="text-center" :class="row.is_total_row ? 'font-semibold text-neutral-900' : 'text-neutral-900'">{{ row.gross_amt.toFixed(2) }}</p>
								</template>

								<template #net_amt-data="{ row }">
									<p class="text-center" :class="row.is_total_row ? 'font-semibold text-green-600' : 'font-medium text-neutral-900'">
										{{ row.net_amt.toFixed(2) }}
									</p>
								</template>

								<template #empty-state>
									<div class="flex flex-col items-center justify-center py-6">
										<span class="text-sm text-neutral-500">No items found</span>
									</div>
								</template>
							</UTable>
						</div>
					</div>
				</UCard>
			</div>

			<!-- Pagination -->
			<div v-if="data.length > 0" class="mt-6 flex justify-center">
				<UPagination v-model="current_page" :page-count="sale_summ_items.page_size" :total="sale_summ_items.total_data" @update:model-value="updatePage" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { getFormattedDate, OrderItemStatus } from 'wemotoo-common';
import { sale_summ_item_columns } from '~/utils/table-columns';

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

useHead({ title: 'Wemotoo CRM - Sale Item Summary' });

onMounted(async () => {
	await salesSummStore.getSaleItemSummary();
});

const salesSummStore = useSummSaleStore();
const { sale_summ_items } = storeToRefs(salesSummStore);
const current_page = computed(() => sale_summ_items.value.current_page);

const is_loading = computed(() => sale_summ_items.value.is_loading);
const data = computed(() => sale_summ_items.value.data);

const selectedColumns = ref(sale_summ_item_columns);

// Group data by date
const groupedByDate = computed(() => {
	const grouped: { [key: string]: (typeof data.value)[0][] } = {};

	data.value.forEach((item) => {
		const date = new Date(item.biz_date).toISOString().split('T')[0] as string;
		if (!grouped[date]) {
			grouped[date] = [];
		}
		grouped[date].push(item);
	});

	return Object.entries(grouped).map(([date, items]) => {
		const totals = items.reduce(
			(acc, item) => {
				acc.total_orders += item.total_orders;
				acc.total_qty += item.total_qty;
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;

				// Separate voided and non-voided quantities
				if (item.item_status === OrderItemStatus.VOIDED) {
					acc.voided_qty += item.total_qty;
				} else {
					acc.active_qty += item.total_qty;
				}
				return acc;
			},
			{ total_orders: 0, total_qty: 0, gross_amt: 0, net_amt: 0, voided_qty: 0, active_qty: 0 },
		);

		// Add total row to items with a special flag
		const itemsWithTotal = [
			...items,
			{
				...items[0],
				prod_code: 'TOTAL_ROW',
				prod_name: 'Total:',
				total_qty: totals.total_qty,
				gross_amt: totals.gross_amt,
				net_amt: totals.net_amt,
				is_total_row: true,
			} as any,
		];

		return {
			date,
			items: itemsWithTotal,
			...totals,
		};
	});
});

// const updateColumns = (columns: { key: string; label: string }[]) => {
// 	selectedColumns.value = columns;
// };

const updatePage = async (page: number) => {
	sale_summ_items.value.current_page = page;
	await salesSummStore.getSaleItemSummary();
};

const exportSalesItemsToCsv = async () => {
	await salesSummStore.exportSaleItemSummary();
};
</script>

<style scoped>
:deep(tr:last-child) {
	background-color: rgb(249 250 251);
	border-top: 2px solid rgb(209 213 219);
}

:deep(table) {
	table-layout: fixed;
}

:deep(th:nth-child(1)),
:deep(td:nth-child(1)) {
	width: 30%;
}

:deep(th:nth-child(2)),
:deep(td:nth-child(2)) {
	width: 18%;
}

:deep(th:nth-child(3)),
:deep(td:nth-child(3)) {
	width: 17%;
}

:deep(th:nth-child(4)),
:deep(td:nth-child(4)) {
	width: 17%;
}

:deep(th:nth-child(5)),
:deep(td:nth-child(5)) {
	width: 18%;
}
</style>
