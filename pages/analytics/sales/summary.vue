<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSumm />

			<!-- Loading State -->
			<div v-if="is_loading" class="flex justify-center items-center py-12">
				<div class="text-gray-500">Loading...</div>
			</div>

			<!-- Empty State -->
			<UCard v-else-if="groupedByDate.length === 0" class="mt-4">
				<div class="flex flex-col items-center justify-center py-12 gap-3">
					<Icon name="i-heroicons-inbox" class="text-gray-400 text-4xl" />
					<span class="text-gray-500">No sales data found</span>
				</div>
			</UCard>

			<!-- Grouped by Date -->
			<div v-else class="mt-4">
				<UCard class="overflow-hidden">
					<template #header>
						<div class="flex-jend">
							<UButton :disabled="sale_summ.exporting" :loading="sale_summ.exporting" @click="exportSalesSummary">
								<UIcon :name="ICONS.EXCEL" class="size-5" />
								Export
							</UButton>
						</div>
					</template>

					<div v-for="(group, index) in groupedByDate" :key="group.date">
						<!-- Date Header -->
						<div class="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary px-6 py-4" :class="{ 'border-t border-gray-200': index > 0 }">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<h3 class="text-lg font-bold text-gray-900">{{ getFormattedDate(new Date(group.date)) }}</h3>
									<div class="flex items-center gap-3 text-sm">
										<div class="flex items-center gap-1.5 text-gray-600">
											<Icon name="i-heroicons-banknotes" class="text-base" />
											<span class="font-medium">{{ group.total_txns }} transactions</span>
										</div>
										<div class="h-4 w-px bg-gray-300"></div>
										<div class="flex items-center gap-1.5 text-green-600">
											<Icon name="i-heroicons-cube" class="text-base" />
											<span class="font-medium">{{ group.active_qty }} items</span>
										</div>
										<div v-if="group.voided_qty > 0" class="h-4 w-px bg-gray-300"></div>
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
								:rows="group.items"
								:columns="columnsTable"
								:ui="{ tr: { base: '' }, table: 'table-fixed', divide: 'divide-y divide-gray-200', wrapper: 'relative overflow-auto' }"
							>
								<template #status-data="{ row }">
									<div class="flex justify-center">
										<UBadge v-if="row.status == SaleStatus.COMPLETED" variant="soft" color="green" size="xs">Completed</UBadge>
									</div>
								</template>

								<template #currency_code-data="{ row }">
									<p class="text-center">{{ row.currency_code }}</p>
								</template>

								<template #gross_amt-data="{ row }">
									<p class="text-center">{{ row.gross_amt.toFixed(2) }}</p>
								</template>

								<template #net_amt-data="{ row }">
									<p class="text-center font-medium text-gray-900">{{ row.net_amt.toFixed(2) }}</p>
								</template>

								<template #total_txns-data="{ row }">
									<p class="text-center">{{ row.total_txns }}</p>
								</template>

								<template #total_qty-data="{ row }">
									<p class="text-center">{{ row.total_qty }}</p>
								</template>

								<template #total_voided_qty-data="{ row }">
									<p class="text-center">{{ row.total_voided_qty }}</p>
								</template>

								<template #empty-state>
									<div class="flex flex-col items-center justify-center py-6">
										<span class="text-sm text-gray-500">No items found</span>
									</div>
								</template>
							</UTable>
						</div>
					</div>
				</UCard>
			</div>

			<!-- Pagination -->
			<div v-if="data.length > 0" class="mt-6 flex justify-center">
				<UPagination v-model="current_page" :page-count="sale_summ.page_size" :total="sale_summ.total_data" @update:model-value="updatePage" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SaleStatus, getFormattedDate } from 'wemotoo-common';
import { sale_summ_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Sales Summary',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/summary',
	},
];

useHead({ title: 'Wemotoo CRM - Sale Summary' });

onMounted(async () => {
	await salesSummStore.getSaleSummary();
});

const salesSummStore = useSummSaleStore();
const { sale_summ } = storeToRefs(salesSummStore);

const is_loading = computed(() => sale_summ.value.is_loading);
const data = computed(() => sale_summ.value.data);
const selectedColumns = ref(sale_summ_columns);
const columnsTable = computed(() => sale_summ_columns.filter((column) => selectedColumns.value.includes(column)));

const current_page = computed(() => sale_summ.value.current_page);

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
				acc.total_txns += item.total_orders;
				acc.total_qty += item.total_qty;
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;

				// Calculate voided quantity (total_qty - total_voided_qty = active)
				acc.voided_qty += item.total_voided_qty || 0;
				acc.active_qty += item.total_qty - (item.total_voided_qty || 0);
				return acc;
			},
			{ total_txns: 0, total_qty: 0, gross_amt: 0, net_amt: 0, voided_qty: 0, active_qty: 0 },
		);

		return {
			date,
			items: items,
			...totals,
		};
	});
});

const updatePage = async (page: number) => {
	sale_summ.value.current_page = page;
	await salesSummStore.getSaleSummary();
};

const exportSalesSummary = async () => {
	await salesSummStore.exportSalesSummary();
};
</script>

<style scoped lang="postcss"></style>
