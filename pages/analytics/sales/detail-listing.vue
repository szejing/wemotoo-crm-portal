<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSales />
			<UCard class="mt-4">
				<div class="flex-jbetween-icenter">
					<div class="flex gap-4">
						<!-- <UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton> -->

						<!-- <UButton color="green" @click="navigateTo('/orders/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton> -->
					</div>

					<div class="flex gap-4">
						<span class="section-page-size">
							<USelect v-model="filter.page_size" :options="options_page_size" @update:model-value="updatePageSize" />
						</span>

						<ZSelectMenuTableColumns :columns="sale_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</div>

				<UTable :rows="rows" :columns="columnsTable" :loading="loading" @select="selectSale">
					<template #index-data="{ index }">
						<p>{{ index + 1 }}.</p>
					</template>

					<template #biz_date-data="{ row }">
						<p v-if="row.biz_date">{{ getFormattedDate(new Date(row.biz_date)) }}</p>
					</template>

					<template #currency_code-data="{ row }">
						<p>{{ row.currency_code }}</p>
					</template>

					<template #status-data="{ row }">
						<UBadge v-if="row.status === SaleStatus.COMPLETED" variant="outline" color="green">COMPLETED</UBadge>
						<UBadge v-else-if="row.status === SaleStatus.REFUNDED" variant="outline" color="main">REFUNDED</UBadge>
						<UBadge v-else-if="row.status === SaleStatus.CANCELLED" variant="outline" color="red">CANCELLED</UBadge>
					</template>

					<!-- <template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #gross_amt-data="{ row }">
						<p>{{ row.gross_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #net_amt-data="{ row }">
						<p>{{ row.net_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #disc_amt-header>
						<p>
							Disc Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #disc_amt-data="{ row }">
						<p>{{ row.disc_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #void_amt-header>
						<p>
							Void Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #void_amt-data="{ row }">
						<p>{{ row.void_amt.toFixed(2) }}</p>
					</template>

					<template #total_qty-data="{ row }">
						<p>{{ row.total_order_qty }}</p>
					</template>

					<template #total_voided_qty-data="{ row }">
						<p v-if="row.voided_qty">{{ row.voided_qty }}</p>
						<p v-else>0</p>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Sales !</span>
						</div>
					</template>
				</UTable>

				<div v-if="bills.length > 0" class="section-pagination">
					<UPagination v-model="current_page" :page-count="filter.page_size" :total="total_bills" @update:model-value="updatePage" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SaleStatus, getFormattedDate } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
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
const { bills, filter, total_bills, loading } = storeToRefs(saleStore);

const selectedColumns = ref(sale_columns);
const columnsTable = computed(() => sale_columns.filter((column) => selectedColumns.value.includes(column)));

const current_page = computed(() => filter.value.current_page);

const updateColumns = (columns: { key: string; label: string; sortable?: boolean }[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return bills.value.slice((current_page.value - 1) * filter.value.page_size, current_page.value * filter.value.page_size);
});

const updatePageSize = async (size: number) => {
	filter.value.page_size = size;
	await saleStore.getBills();
};

const updatePage = async (page: number) => {
	filter.value.current_page = page;
	await saleStore.getBills();
};

const selectSale = (row: Bill) => {
	navigateTo(`/bills/detail/${row.bill_no}`);
};
</script>

<style scoped lang="postcss"></style>
