<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSales />

			<!-- Loading State -->
			<div v-if="loading" class="flex justify-center items-center py-12">
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
							<UButton :disabled="exporting" :loading="exporting" @click="exportSalesToCsv">
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
											<span class="font-medium">{{ group.total_items }} transactions</span>
										</div>
										<div class="h-4 w-px bg-gray-300"></div>
										<div class="flex items-center gap-1.5 text-green-600">
											<Icon name="i-heroicons-cube" class="text-base" />
											<span class="font-medium">{{ group.total_qty }} items</span>
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
								:ui="{
									tr: { base: 'cursor-pointer hover:bg-gray-50' },
									table: 'table-fixed',
									divide: 'divide-y divide-gray-200',
									wrapper: 'relative overflow-auto',
								}"
								@select="selectSale"
							>
								<template #bill_no-data="{ row }">
									<p>{{ row.bill_no }}</p>
								</template>

								<template #status-data="{ row }">
									<UBadge v-if="row.status === SaleStatus.COMPLETED" variant="soft" color="green" size="xs">Completed</UBadge>
									<UBadge v-else-if="row.status === SaleStatus.REFUNDED" variant="soft" color="orange" size="xs">Refunded</UBadge>
									<UBadge v-else-if="row.status === SaleStatus.CANCELLED" variant="soft" color="red" size="xs">Cancelled</UBadge>
								</template>

								<template #gross_amt-data="{ row }">
									<p class="text-center">{{ row.gross_amt.toFixed(2) }}</p>
								</template>

								<template #net_amt-data="{ row }">
									<p class="text-center font-medium text-gray-900">{{ row.net_amt.toFixed(2) }}</p>
								</template>

								<template #disc_amt-data="{ row }">
									<p class="text-center">{{ row.disc_amt.toFixed(2) }}</p>
								</template>

								<template #void_amt-data="{ row }">
									<p class="text-center">{{ row.void_amt ? row.void_amt.toFixed(2) : '0.00' }}</p>
								</template>

								<template #total_item_qty-data="{ row }">
									<p class="text-center">{{ row.total_item_qty || 0 }}</p>
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
			<div v-if="bills.length > 0" class="mt-6 flex justify-center">
				<UPagination v-model="current_page" :page-count="filter.page_size" :total="total_bills" @update:model-value="updatePage" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SaleStatus, getFormattedDate } from 'wemotoo-common';
import { sale_columns } from '~/utils/table-columns';
import type { Bill } from '~/repository/modules/sale/models/response/bill';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Sales Detail Listing',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/detail-listing',
	},
];

useHead({ title: 'Wemotoo CRM - Sale Detail Listing' });

onMounted(async () => {
	await saleStore.getBills();
});

const saleStore = useSaleStore();
const { bills, filter, total_bills, loading, exporting } = storeToRefs(saleStore);

const selectedColumns = ref(sale_columns);
const columnsTable = computed(() =>
	sale_columns.filter((column) => selectedColumns.value.includes(column) && column.key !== 'index' && column.key !== 'biz_date'),
);

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
				return acc;
			},
			{ total_items: 0, total_qty: 0, gross_amt: 0, net_amt: 0, disc_amt: 0, voided_amt: 0 },
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

const selectSale = (row: Bill) => {
	navigateTo(`/bills/detail/${encodeURIComponent(row.bill_no)}`);
};

const exportSalesToCsv = async () => {
	await saleStore.exportBills();
};
</script>

<style scoped lang="postcss"></style>
