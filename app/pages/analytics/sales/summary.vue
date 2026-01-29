<template>
	<UDashboardPanel id="analytics-sales-summary">
		<template #header>
			<UDashboardNavbar title="Analytics Sales Summary" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterSaleSumm />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<div v-if="!loading && groupedByDate.length == 0">
					<div class="flex flex-col items-center justify-center py-6">
						<UIcon :name="ICONS.REPORT_SALES" class="w-12 h-12 text-gray-400" />
						<p class="text-sm text-gray-600 dark:text-gray-400">No sales summary data found.</p>
						<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
					</div>
				</div>

				<div v-else>
					<!-- Table Controls -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
						<!-- Page Size -->
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
							<USelect v-model="sale_summ.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
							<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
						</div>
					</div>

					<div v-for="(group, index) in groupedByDate" :key="group.date" class="mt-4">
						<!-- Date Header -->
						<div class="bg-linear-to-r from-primary/5 to-primary/10 border-l-4 border-primary px-6 py-4" :class="{ 'border-t border-neutral-200': index > 0 }">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<h3 class="text-lg font-bold text-neutral-900">{{ getFormattedDate(new Date(group.date)) }}</h3>
									<div class="flex items-center gap-3 text-sm">
										<div class="flex items-center gap-1.5 text-neutral-600">
											<Icon name="i-heroicons-banknotes" class="text-base" />
											<span class="font-medium">{{ group.total_txns }} transactions</span>
										</div>
									</div>
								</div>
								<div class="flex items-center gap-2 text-sm font-semibold text-primary">
									<span>Total: {{ formatCurrency(group.net_amt, group.currency_code) }}</span>
								</div>
							</div>
						</div>

						<!-- Items Table -->
						<div class="px-6 pb-6 pt-4">
							<UTable :data="group.items" :columns="sale_summ_columns" :loading="loading" />
						</div>
					</div>
				</div>
			</div>

			<!-- Pagination -->
			<div v-if="data.length > 0" class="mt-6 flex justify-center">
				<UPagination v-model="current_page" :items-per-page="sale_summ.page_size" :total="sale_summ.total_data" @update:page="updatePage" />
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { getFormattedDate, formatCurrency } from 'wemotoo-common';
import { sale_summ_columns } from '~/utils/table-columns';
import { options_page_size } from '~/utils/options';

useHead({ title: 'Wemotoo CRM - Sale Summary' });

onMounted(async () => {
	await salesSummStore.getSaleSummary();
});

const salesSummStore = useSummSaleStore();
const { sale_summ, loading } = storeToRefs(salesSummStore);

const data = computed(() => sale_summ.value.data);

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
				acc.total_txns += item.total_txns;
				acc.total_qty += item.total_qty;
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;
				acc.currency_code = item.currency_code;

				return acc;
			},
			{ total_txns: 0, total_qty: 0, gross_amt: 0, net_amt: 0, currency_code: 'MYR' },
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

const updatePageSize = async (size: number) => {
	await salesSummStore.updateSaleSummPageSize(size);
};

// const exportSalesSummary = async () => {
// 	await salesSummStore.exportSalesSummary();
// };
</script>

<style scoped></style>
