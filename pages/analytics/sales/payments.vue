<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSummPayments />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<ZSelectMenuTableColumns :columns="sale_summ_payment_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
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
						<UBadge v-if="row.status == SaleStatus.COMPLETED" variant="outline" color="green">COMPLETED</UBadge>
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

					<template #total_txns-data="{ row }">
						<p>{{ row.total_txns }}</p>
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
					<UPagination
						v-model="current_page"
						:page-count="sale_summ_payments.page_size"
						:total="sale_summ_payments.total_data"
						@update:model-value="updatePage"
					/>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SaleStatus, getFormattedDate } from 'wemotoo-common';
import { sale_summ_payment_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Payment Reports',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/payments',
	},
];

onMounted(async () => {
	await salesSummStore.getSalePaymentSummary();
});

const salesSummStore = useSummSaleStore();
const { sale_summ_payments } = storeToRefs(salesSummStore);
const current_page = computed(() => sale_summ_payments.value.current_page);

const currency_code = ref(sale_summ_payments.value.filter.currency_code);

const is_loading = computed(() => sale_summ_payments.value.is_loading);
const data = computed(() => sale_summ_payments.value.data);
const selectedColumns = ref(sale_summ_payment_columns);
const columnsTable = computed(() => sale_summ_payment_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: { key: string; label: string }[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return data.value.slice((current_page.value - 1) * sale_summ_payments.value.page_size, current_page.value * sale_summ_payments.value.page_size);
});

const updatePage = async (page: number) => {
	sale_summ_payments.value.current_page = page;
	await salesSummStore.getSalePaymentSummary();
};
</script>

<style scoped lang="postcss"></style>
