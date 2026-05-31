<template>
	<ZPagePanel id="analytics-sales-summary" :title="$t('pages.analyticsSalesSummary')" back-to="/analytics/sales">
		<template #toolbar>
			<ZSectionFilterSaleSumm />
		</template>

		<div class="space-y-6">
			<ZTableToolbar
				v-model="sale_summ.page_size"
				:page-size-options="options_page_size"
				:export-enabled="true"
				:exporting="sale_summ.exporting"
				@update:model-value="updatePageSize"
				@export="salesSummStore.exportSalesSummary"
			/>

			<UCard class="overflow-hidden">
				<UTable
					:data="dailyRows"
					:columns="dailyColumns"
					:loading="loading"
					:ui="{
						root: 'relative overflow-auto',
						base: 'min-w-[760px]',
						th: 'whitespace-nowrap',
						td: 'whitespace-nowrap',
						tfoot: 'bg-elevated/50 border-t border-default',
					}"
				>
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.REPORT_SALES" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noSalesSummaryFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>
			</UCard>

			<div v-if="data.length > 0" class="flex justify-center">
				<UPagination v-model="current_page" :items-per-page="sale_summ.page_size" :total="sale_summ.total_data" @update:page="updatePage" />
			</div>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { getFormattedDate, formatCurrency } from 'wemotoo-common';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { options_page_size } from '~/utils/options';
import type { SummSaleBill } from '~/utils/types/summ-sales';

const route = useRoute();
const { t } = useI18n();
useHead({ title: () => t('pages.saleSummaryTitle') });

const salesSummStore = useSummSaleStore();

function applyQueryToFilter() {
	const start = route.query.start_date;
	const end = route.query.end_date;
	if (typeof start === 'string' && start) {
		const d = new Date(start);
		if (!Number.isNaN(d.getTime())) {
			salesSummStore.sale_summ.filter.date_range.start = d;
		}
	}
	if (typeof end === 'string' && end) {
		const d = new Date(end);
		if (!Number.isNaN(d.getTime())) {
			salesSummStore.sale_summ.filter.date_range.end = d;
		}
	}
}

onMounted(async () => {
	applyQueryToFilter();
	await salesSummStore.getSaleSummary();
});

watch(
	() => route.query.start_date && route.query.end_date,
	() => {
		applyQueryToFilter();
		salesSummStore.getSaleSummary();
	},
);
const { sale_summ } = storeToRefs(salesSummStore);
const loading = computed(() => sale_summ.value.loading);

const data = computed(() => sale_summ.value.data);

const current_page = computed({
	get: () => sale_summ.value.current_page,
	set: (page: number) => {
		sale_summ.value.current_page = page;
	},
});

type SaleDailyRow = {
	date: string;
	currency_code: string;
	total_txns: number;
	total_items: number;
	voided_items: number;
	gross_amt: number;
	net_amt: number;
	tax_amt: number;
	shipping_amt: number;
};

const alignRight = 'text-right tabular-nums';

const headerCell = (label: string, align: 'left' | 'right' = 'left') => h('div', { class: align === 'right' ? alignRight : undefined }, label);
const numberCell = (value: number) => h('div', { class: alignRight }, value);
const moneyCell = (value: number, currencyCode: string) => h('div', { class: alignRight }, formatCurrency(value, currencyCode));

const getTaxAmount = (item: Pick<SummSaleBill, 'tax_amt_inc' | 'tax_amt_exc'>) => (item.tax_amt_inc ?? 0) + (item.tax_amt_exc ?? 0);

const getShippingAmount = (item: SummSaleBill) => {
	const fields = item as SummSaleBill & { shipping_amt?: number; shipping_fee?: number };
	if (typeof fields.shipping_amt === 'number') return fields.shipping_amt;
	if (typeof fields.shipping_fee === 'number') return fields.shipping_fee;

	return Math.max(item.net_amt - item.gross_amt - getTaxAmount(item), 0);
};

const sumColumn = (rows: TableRow<SaleDailyRow>[], key: keyof Pick<SaleDailyRow, 'total_txns' | 'total_items' | 'voided_items' | 'gross_amt' | 'net_amt' | 'tax_amt' | 'shipping_amt'>) =>
	rows.reduce((total, row) => total + row.original[key], 0);

const dailyColumns = computed<TableColumn<SaleDailyRow>[]>(() => [
	{
		accessorKey: 'date',
		header: () => headerCell(t('table.bizDate')),
		cell: ({ row }) => h('div', { class: 'font-medium text-default' }, getFormattedDate(new Date(row.original.date))),
		footer: () => h('div', { class: 'font-semibold text-default' }, t('pages.totalLabel')),
	},
	{
		accessorKey: 'total_txns',
		header: () => headerCell(t('table.totalTransactions'), 'right'),
		cell: ({ row }) => numberCell(row.original.total_txns),
		footer: ({ column }) => numberCell(sumColumn(column.getFacetedRowModel().rows, 'total_txns')),
	},
	{
		accessorKey: 'total_items',
		header: () => headerCell(t('table.totalItems'), 'right'),
		cell: ({ row }) => numberCell(row.original.total_items),
		footer: ({ column }) => numberCell(sumColumn(column.getFacetedRowModel().rows, 'total_items')),
	},
	{
		accessorKey: 'net_amt',
		header: () => headerCell(t('table.netAmt'), 'right'),
		cell: ({ row }) => moneyCell(row.original.net_amt, row.original.currency_code),
		footer: ({ column }) => moneyCell(sumColumn(column.getFacetedRowModel().rows, 'net_amt'), column.getFacetedRowModel().rows[0]?.original.currency_code ?? 'MYR'),
	},
	{
		accessorKey: 'gross_amt',
		header: () => headerCell(t('table.grossAmt'), 'right'),
		cell: ({ row }) => moneyCell(row.original.gross_amt, row.original.currency_code),
		footer: ({ column }) => moneyCell(sumColumn(column.getFacetedRowModel().rows, 'gross_amt'), column.getFacetedRowModel().rows[0]?.original.currency_code ?? 'MYR'),
	},
	{
		accessorKey: 'tax_amt',
		header: () => headerCell(t('table.taxes'), 'right'),
		cell: ({ row }) => moneyCell(row.original.tax_amt, row.original.currency_code),
		footer: ({ column }) => moneyCell(sumColumn(column.getFacetedRowModel().rows, 'tax_amt'), column.getFacetedRowModel().rows[0]?.original.currency_code ?? 'MYR'),
	},
	{
		accessorKey: 'shipping_amt',
		header: () => headerCell(t('table.shipment.shippingFee'), 'right'),
		cell: ({ row }) => moneyCell(row.original.shipping_amt, row.original.currency_code),
		footer: ({ column }) => moneyCell(sumColumn(column.getFacetedRowModel().rows, 'shipping_amt'), column.getFacetedRowModel().rows[0]?.original.currency_code ?? 'MYR'),
	},
	{
		accessorKey: 'voided_items',
		header: () => headerCell(t('pages.voidedLabel'), 'right'),
		cell: ({ row }) => numberCell(row.original.voided_items),
		footer: ({ column }) => numberCell(sumColumn(column.getFacetedRowModel().rows, 'voided_items')),
	},
]);

const dailyRows = computed<SaleDailyRow[]>(() => {
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
				acc.total_items += item.total_qty - (item.total_voided_qty || 0);
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;
				acc.tax_amt += getTaxAmount(item);
				acc.shipping_amt += getShippingAmount(item);
				acc.currency_code = item.currency_code;
				acc.voided_items += item.total_voided_qty || 0;

				return acc;
			},
			{ total_txns: 0, total_items: 0, gross_amt: 0, net_amt: 0, tax_amt: 0, shipping_amt: 0, voided_items: 0, currency_code: 'MYR' },
		);

		return {
			date,
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

<style scoped>
:deep(tfoot tr) {
	font-weight: 600;
}
</style>
