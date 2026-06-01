<template>
	<ZPagePanel id="analytics-orders-summary" :title="$t('pages.analyticsOrdersSummary')" back-to="/analytics/orders">
		<template #toolbar>
			<ZSectionFilterOrderSumm />
		</template>

		<div class="space-y-6">
			<ZTableToolbar
				v-model="order_summ.page_size"
				v-model:selected-column-keys="selectedColumnKeys"
				:page-size-options="options_page_size"
				:export-enabled="true"
				:exporting="order_summ.exporting"
				:column-options="columnOptions"
				@update:model-value="updatePageSize"
				@export="orderSummStore.exportOrderSummary"
			/>

			<UCard class="overflow-hidden">
				<UTable
					:data="dailyRows"
					:columns="visibleDailyColumns"
					:loading="loading"
					:ui="{
						root: 'relative overflow-auto',
						base: 'min-w-[980px]',
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
import { UBadge } from '#components';
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

type OrderSummaryColumnKey = keyof SummOrderBill;
type OrderDailyRow = Omit<SummOrderBill, 'status'> & {
	status?: OrderStatus;
};
type NumericOrderSummaryColumnKey = keyof Pick<
	OrderDailyRow,
	| 'gross_amt'
	| 'net_amt'
	| 'disc_amt'
	| 'gross_amt_exc'
	| 'net_amt_exc'
	| 'tax_amt_inc'
	| 'tax_amt_exc'
	| 'void_amt'
	| 'adj_amt'
	| 'total_orders'
	| 'total_qty'
	| 'total_voided_qty'
>;
type ColumnOption = {
	key: OrderSummaryColumnKey;
	label: string;
};
const alignRight = 'text-right tabular-nums';

const headerCell = (label: string, align: 'left' | 'right' = 'left') => h('div', { class: align === 'right' ? alignRight : undefined }, label);
const numberCell = (value: number) => h('div', { class: alignRight }, value);
const moneyCell = (value: number, currencyCode: string) => h('div', { class: alignRight }, formatCurrency(value, currencyCode));
const optionalCell = (value?: number) => (value == null ? h('span', { class: 'text-muted' }, '-') : numberCell(value));
const optionalMoneyCell = (value: number | undefined, currencyCode: string) =>
	value == null ? h('span', { class: 'text-muted' }, '-') : moneyCell(value, currencyCode);

const sumColumn = (rows: TableRow<OrderDailyRow>[], key: NumericOrderSummaryColumnKey) => rows.reduce((total, row) => total + (row.original[key] ?? 0), 0);
const footerCurrency = (rows: TableRow<OrderDailyRow>[]) => rows[0]?.original.currency_code ?? 'MYR';

const orderStatusLabels = computed<Partial<Record<OrderStatus, string>>>(() => ({
	[OrderStatus.COMPLETED]: t('options.completed'),
	[OrderStatus.CANCELLED]: t('options.cancelled'),
	[OrderStatus.REFUNDED]: t('options.refunded'),
	[OrderStatus.PENDING_PAYMENT]: t('options.pendingPayment'),
	[OrderStatus.PROCESSING]: t('options.processing'),
	[OrderStatus.REQUIRES_ACTION]: t('options.requiresAction'),
}));

const orderStatusColors: Partial<Record<OrderStatus, 'success' | 'error' | 'info' | 'warning' | 'neutral'>> = {
	[OrderStatus.COMPLETED]: 'success',
	[OrderStatus.CANCELLED]: 'error',
	[OrderStatus.REFUNDED]: 'error',
	[OrderStatus.PENDING_PAYMENT]: 'info',
	[OrderStatus.PROCESSING]: 'info',
	[OrderStatus.REQUIRES_ACTION]: 'warning',
};

const statusCell = (status?: OrderStatus) => {
	if (!status) return h('span', { class: 'text-muted' }, '-');

	return h(UBadge, { variant: 'subtle', color: orderStatusColors[status] ?? 'neutral', class: 'capitalize' }, () => orderStatusLabels.value[status] ?? status);
};

const createNumberColumn = (key: NumericOrderSummaryColumnKey, label: string): TableColumn<OrderDailyRow> => ({
	accessorKey: key,
	header: () => headerCell(label, 'right'),
	cell: ({ row }) => optionalCell(row.original[key]),
	footer: ({ column }) => numberCell(sumColumn(column.getFacetedRowModel().rows, key)),
});

const createMoneyColumn = (key: NumericOrderSummaryColumnKey, label: string): TableColumn<OrderDailyRow> => ({
	accessorKey: key,
	header: () => headerCell(label, 'right'),
	cell: ({ row }) => optionalMoneyCell(row.original[key], row.original.currency_code),
	footer: ({ column }) => moneyCell(sumColumn(column.getFacetedRowModel().rows, key), footerCurrency(column.getFacetedRowModel().rows)),
});

const columnOptions = computed<ColumnOption[]>(() => [
	{ key: 'biz_date', label: t('table.bizDate') },
	{ key: 'currency_code', label: t('table.currency') },
	{ key: 'status', label: t('table.orderStatus') },
	{ key: 'gross_amt', label: t('table.grossAmt') },
	{ key: 'net_amt', label: t('table.netAmt') },
	{ key: 'disc_amt', label: t('table.discountAmt') },
	{ key: 'gross_amt_exc', label: t('table.grossAmtExc') },
	{ key: 'net_amt_exc', label: t('table.netAmtExc') },
	{ key: 'tax_amt_inc', label: t('table.taxAmtInc') },
	{ key: 'tax_amt_exc', label: t('table.taxAmtExc') },
	{ key: 'void_amt', label: t('table.voidAmt') },
	{ key: 'adj_amt', label: t('table.adjAmt') },
	{ key: 'total_orders', label: t('table.totalOrders') },
	{ key: 'total_qty', label: t('table.totalItems') },
	{ key: 'total_voided_qty', label: t('pages.voidedLabel') },
]);

const dailyColumns = computed<TableColumn<OrderDailyRow>[]>(() => [
	{
		accessorKey: 'biz_date',
		header: () => headerCell(t('table.bizDate')),
		cell: ({ row }) => h('div', { class: 'font-medium text-default' }, getFormattedDate(new Date(row.original.biz_date))),
		footer: () => h('div', { class: 'font-semibold text-default' }, t('pages.totalLabel')),
	},
	{
		accessorKey: 'currency_code',
		header: () => headerCell(t('table.currency')),
		cell: ({ row }) => h('div', { class: 'font-medium text-default' }, row.original.currency_code),
	},
	{
		accessorKey: 'status',
		header: () => headerCell(t('table.orderStatus')),
		cell: ({ row }) => statusCell(row.original.status),
	},
	createMoneyColumn('gross_amt', t('table.grossAmt')),
	createMoneyColumn('net_amt', t('table.netAmt')),
	createMoneyColumn('disc_amt', t('table.discountAmt')),
	createMoneyColumn('gross_amt_exc', t('table.grossAmtExc')),
	createMoneyColumn('net_amt_exc', t('table.netAmtExc')),
	createMoneyColumn('tax_amt_inc', t('table.taxAmtInc')),
	createMoneyColumn('tax_amt_exc', t('table.taxAmtExc')),
	createMoneyColumn('void_amt', t('table.voidAmt')),
	createMoneyColumn('adj_amt', t('table.adjAmt')),
	createNumberColumn('total_orders', t('table.totalOrders')),
	createNumberColumn('total_qty', t('table.totalItems')),
	createNumberColumn('total_voided_qty', t('pages.voidedLabel')),
]);

const { selectedColumnKeys, visibleColumns: visibleDailyColumns } = useTableColumnVisibility(dailyColumns, columnOptions, {
	defaultHiddenKeys: ['currency_code', 'total_voided_qty'],
});

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
		const statuses = new Set(items.map((item) => item.status).filter(Boolean));
		const totals = items.reduce(
			(acc, item) => {
				acc.total_orders += item.total_orders;
				acc.total_qty += item.total_qty;
				acc.total_voided_qty += item.total_voided_qty || 0;
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;
				acc.disc_amt += item.disc_amt ?? 0;
				acc.gross_amt_exc += item.gross_amt_exc;
				acc.net_amt_exc += item.net_amt_exc;
				acc.tax_amt_inc += item.tax_amt_inc ?? 0;
				acc.tax_amt_exc += item.tax_amt_exc ?? 0;
				acc.void_amt += item.void_amt ?? 0;
				acc.adj_amt += item.adj_amt ?? 0;
				acc.currency_code = item.currency_code;
				return acc;
			},
			{
				total_orders: 0,
				total_qty: 0,
				total_voided_qty: 0,
				gross_amt: 0,
				net_amt: 0,
				disc_amt: 0,
				gross_amt_exc: 0,
				net_amt_exc: 0,
				tax_amt_inc: 0,
				tax_amt_exc: 0,
				void_amt: 0,
				adj_amt: 0,
				currency_code: 'MYR',
			},
		);

		return {
			biz_date: new Date(date),
			status: statuses.size === 1 ? Array.from(statuses)[0] : undefined,
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
