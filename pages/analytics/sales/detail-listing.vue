<template>
	<UDashboardPanel id="analytics-sales-detail-listing">
		<template #header>
			<UDashboardNavbar title="Analytics Sales Detail Listing" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterSaleSummDetailListing />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<!-- Grouped by Date -->
			<div class="space-y-6">
				<div v-if="!loading && groupedByDate.length == 0">
					<div class="flex flex-col items-center justify-center py-6">
						<UIcon :name="ICONS.REPORT_SALES" class="w-12 h-12 text-gray-400" />
						<p class="text-sm text-gray-600 dark:text-gray-400">No sales detail listing data found.</p>
						<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
					</div>
				</div>

				<div v-else>
					<!-- Table Controls -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
						<!-- Page Size -->
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
							<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
							<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
						</div>
					</div>

					<div v-for="(group, index) in groupedByDate" :key="group.date">
						<!-- Date Header -->
						<div class="bg-linear-to-r from-primary/5 to-primary/10 border-l-4 border-primary px-6 py-4" :class="{ 'border-t border-neutral-200': index > 0 }">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<h3 class="text-lg font-bold text-neutral-900">{{ getFormattedDate(new Date(group.date)) }}</h3>
									<div class="flex items-center gap-3 text-sm">
										<div class="flex items-center gap-1.5 text-neutral-600">
											<Icon name="i-heroicons-banknotes" class="text-base" />
											<span class="font-medium">{{ group.total_items }} transactions</span>
										</div>
										<div class="h-4 w-px bg-neutral-300"></div>
										<div class="flex items-center gap-1.5 text-green-600">
											<Icon name="i-heroicons-cube" class="text-base" />
											<span class="font-medium">{{ group.total_qty }} items</span>
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
							<UTable :data="group.items" :columns="sale_columns" :loading="loading" @select="selectSale" />
						</div>
					</div>
				</div>
			</div>

			<!-- Pagination -->
			<div v-if="bills.length > 0" class="mt-6 flex justify-center">
				<UPagination :default-page="current_page" :items-per-page="filter.page_size" :total="total_bills" @update:page="updatePage" />
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { getFormattedDate } from 'wemotoo-common';
import { sale_columns } from '~/utils/table-columns';
import type { Bill } from '~/repository/modules/sale/models/response/bill';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';

useHead({ title: 'Wemotoo CRM - Sale Detail Listing' });

onMounted(async () => {
	await saleStore.getBills();
});

const saleStore = useSaleStore();
const { bills, filter, total_bills, loading } = storeToRefs(saleStore);
const current_page = computed(() => filter.value.current_page);

// Group data by date
const groupedByDate = computed(() => {
	const grouped: { [key: string]: Bill[] } = {};

	bills.value.forEach((item) => {
		const date = new Date(item.biz_date).toISOString().split('T')[0] as string;
		if (!grouped[date]) {
			grouped[date] = [];
		}
		grouped[date].push(item);
	});

	return Object.entries(grouped).map(([date, items]) => {
		const totals = items.reduce(
			(acc, item) => {
				acc.total_items += 1;
				acc.total_qty += item.total_item_qty || 0;
				acc.gross_amt += item.gross_amt || 0;
				acc.net_amt += item.net_amt || 0;
				acc.disc_amt += item.disc_amt || 0;
				acc.voided_amt += item.void_amt || 0;
				acc.currency_code = item.currency.code;
				return acc;
			},
			{ total_items: 0, total_qty: 0, gross_amt: 0, net_amt: 0, disc_amt: 0, voided_amt: 0, currency_code: 'MYR' },
		);

		return {
			date,
			items: items,
			...totals,
		};
	});
});

const updatePage = async (page: number) => {
	filter.value.current_page = page;
	await saleStore.getBills();
};

const updatePageSize = async (size: number) => {
	filter.value.page_size = size;

	if (filter.value.page_size > total_bills.value) {
		filter.value.current_page = 1;
		return;
	}
};

const selectSale = (e: Event, row: TableRow<Bill>) => {
	const bill = row.original;
	if (!bill) return;

	navigateTo(`/bills/detail/${encodeURIComponent(bill.bill_no)}`);
};
</script>

<style scoped></style>
