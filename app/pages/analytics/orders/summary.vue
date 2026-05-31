<template>
	<ZPagePanel id="analytics-orders-summary" :title="$t('pages.analyticsOrdersSummary')" back-to="/analytics/orders">
		<template #toolbar>
			<ZSectionFilterOrderSumm />
		</template>

		<div class="space-y-6">
			<ZTableToolbar
				v-model="order_summ.page_size"
				:page-size-options="options_page_size"
				:export-enabled="true"
				:exporting="order_summ.exporting"
				@update:model-value="updatePageSize"
				@export="orderSummStore.exportOrderSummary"
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
							<UIcon :name="ICONS.REPORT_ORDER" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noOrderSummaryFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>
			</UCard>

			<div v-if="data.length > 0" class="flex justify-center">
				<UPagination v-model="current_page" :items-per-page="order_summ.page_size" :total="order_summ.total_data" @update:page="updatePage" />
			</div>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { getFormattedDate, formatCurrency, OrderStatus } from 'wemotoo-common';
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { SummOrderBill } from '~/utils/types/summ-orders';
import { options_page_size } from '~/utils/options';

const route = useRoute();
const { t } = useI18n();
useHead({ title: () => t('pages.orderSummaryTitle') });

const orderSummStore = useSummOrderStore();
const { order_summ } = storeToRefs(orderSummStore);
const loading = computed(() => order_summ.value.loading);

const VALID_ORDER_STATUSES = new Set(Object.values(OrderStatus));

const applyQueryToFilter = () => {
	const start = route.query.start_date;
	const end = route.query.end_date;
	const status = route.query.status;
	if (typeof start === 'string' && start) {
		const d = new Date(start);
		if (!Number.isNaN(d.getTime())) {
			orderSummStore.order_summ.filter.date_range.start = d;
		}
	}
	if (typeof end === 'string' && end) {
		const d = new Date(end);
		if (!Number.isNaN(d.getTime())) {
			orderSummStore.order_summ.filter.date_range.end = d;
		}
	}
	if (typeof status === 'string' && VALID_ORDER_STATUSES.has(status as OrderStatus)) {
		orderSummStore.order_summ.filter.status = status as OrderStatus;
	}
};

onMounted(async () => {
	applyQueryToFilter();
	await orderSummStore.getOrderSummary();
});

watch(
	() => ({ start: route.query.start_date, end: route.query.end_date, status: route.query.status }),
	() => {
		applyQueryToFilter();
		orderSummStore.getOrderSummary();
	},
	{ deep: true },
);

const data = computed(() => order_summ.value.data);
const current_page = computed({
	get: () => order_summ.value.current_page,
	set: (page: number) => {
		order_summ.value.current_page = page;
	},
});

type OrderDailyRow = {
	date: string;
	currency_code: string;
	total_orders: number;
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

const getTaxAmount = (item: Pick<SummOrderBill, 'tax_amt_inc' | 'tax_amt_exc'>) => (item.tax_amt_inc ?? 0) + (item.tax_amt_exc ?? 0);

const getShippingAmount = (item: SummOrderBill) => {
	const fields = item as SummOrderBill & { shipping_amt?: number; shipping_fee?: number };
	if (typeof fields.shipping_amt === 'number') return fields.shipping_amt;
	if (typeof fields.shipping_fee === 'number') return fields.shipping_fee;

	return Math.max(item.net_amt - item.gross_amt - getTaxAmount(item), 0);
};

const sumColumn = (rows: TableRow<OrderDailyRow>[], key: keyof Pick<OrderDailyRow, 'total_orders' | 'total_items' | 'voided_items' | 'gross_amt' | 'net_amt' | 'tax_amt' | 'shipping_amt'>) =>
	rows.reduce((total, row) => total + row.original[key], 0);

const dailyColumns = computed<TableColumn<OrderDailyRow>[]>(() => [
	{
		accessorKey: 'date',
		header: () => headerCell(t('table.bizDate')),
		cell: ({ row }) => h('div', { class: 'font-medium text-default' }, getFormattedDate(new Date(row.original.date))),
		footer: () => h('div', { class: 'font-semibold text-default' }, t('pages.totalLabel')),
	},
	{
		accessorKey: 'total_orders',
		header: () => headerCell(t('table.totalOrders'), 'right'),
		cell: ({ row }) => numberCell(row.original.total_orders),
		footer: ({ column }) => numberCell(sumColumn(column.getFacetedRowModel().rows, 'total_orders')),
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

const dailyRows = computed<OrderDailyRow[]>(() => {
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
				acc.total_items += item.total_qty - (item.total_voided_qty || 0);
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;
				acc.tax_amt += getTaxAmount(item);
				acc.shipping_amt += getShippingAmount(item);
				acc.currency_code = item.currency_code;
				acc.voided_items += item.total_voided_qty || 0;
				return acc;
			},
			{ total_orders: 0, total_items: 0, gross_amt: 0, net_amt: 0, tax_amt: 0, shipping_amt: 0, voided_items: 0, currency_code: 'MYR' },
		);

		return {
			date,
			...totals,
		};
	});
});

const updatePage = async (page: number) => {
	order_summ.value.current_page = page;
	await orderSummStore.getOrderSummary();
};

const updatePageSize = async (size: number) => {
	await orderSummStore.updateOrderSummPageSize(size);
};
</script>

<style scoped>
:deep(tfoot tr) {
	font-weight: 600;
}
</style>
