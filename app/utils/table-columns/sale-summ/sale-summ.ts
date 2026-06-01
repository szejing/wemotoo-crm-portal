import { h } from 'vue';
import { UBadge } from '#components';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { formatCurrency, getFormattedDate, OrderStatus } from 'wemotoo-common';
import type { SummSaleBill } from '~/utils/types/summ-sales';

type TranslateFn = (key: string) => string;

export type SaleSummTableRow = Omit<SummSaleBill, 'status'> & {
	status?: OrderStatus;
};

type NumericSaleSummColumnKey = keyof Pick<
	SaleSummTableRow,
	| 'gross_amt'
	| 'net_amt'
	| 'disc_amt'
	| 'gross_amt_exc'
	| 'net_amt_exc'
	| 'tax_amt_inc'
	| 'tax_amt_exc'
	| 'void_amt'
	| 'adj_amt'
	| 'total_txns'
	| 'total_qty'
	| 'total_voided_qty'
>;

export const SALE_SUMM_COLUMN_LABELS = {
	biz_date: 'table.bizDate',
	currency_code: 'table.currency',
	status: 'table.orderStatus',
	gross_amt: 'table.grossAmt',
	net_amt: 'table.netAmt',
	disc_amt: 'table.discountAmt',
	gross_amt_exc: 'table.grossAmtExc',
	net_amt_exc: 'table.netAmtExc',
	tax_amt_inc: 'table.taxAmtInc',
	tax_amt_exc: 'table.taxAmtExc',
	void_amt: 'table.voidAmt',
	adj_amt: 'table.adjAmt',
	total_txns: 'table.totalTransactions',
	total_qty: 'table.totalItems',
	total_voided_qty: 'pages.voidedLabel',
} as const satisfies Record<keyof SummSaleBill, string>;

const alignRight = 'text-right tabular-nums';

const headerCell = (label: string, align: 'left' | 'right' = 'left') => h('div', { class: align === 'right' ? alignRight : undefined }, label);
const statusColors: Partial<Record<OrderStatus, 'success' | 'error' | 'info' | 'warning' | 'neutral'>> = {
	[OrderStatus.COMPLETED]: 'success',
	[OrderStatus.CANCELLED]: 'error',
	[OrderStatus.REFUNDED]: 'error',
	[OrderStatus.PENDING_PAYMENT]: 'info',
	[OrderStatus.PROCESSING]: 'info',
	[OrderStatus.REQUIRES_ACTION]: 'warning',
};

const statusLabelKeys: Partial<Record<OrderStatus, string>> = {
	[OrderStatus.COMPLETED]: 'options.completed',
	[OrderStatus.CANCELLED]: 'options.cancelled',
	[OrderStatus.REFUNDED]: 'options.refunded',
	[OrderStatus.PENDING_PAYMENT]: 'options.pendingPayment',
	[OrderStatus.PROCESSING]: 'options.processing',
	[OrderStatus.REQUIRES_ACTION]: 'options.requiresAction',
};

const numberCell = (value: number) => h('div', { class: alignRight }, value);
const moneyCell = (value: number, currencyCode: string) => h('div', { class: alignRight }, formatCurrency(value, currencyCode));
const optionalMoneyCell = (value: number | undefined, currencyCode: string) =>
	value == null ? h('span', { class: 'text-muted' }, '-') : moneyCell(value, currencyCode);

const sumColumn = (rows: TableRow<SaleSummTableRow>[], key: NumericSaleSummColumnKey) => rows.reduce((total, row) => total + (row.original[key] ?? 0), 0);
const footerCurrency = (rows: TableRow<SaleSummTableRow>[]) => rows[0]?.original.currency_code ?? 'MYR';

const createNumberColumn = (key: NumericSaleSummColumnKey, label: string): TableColumn<SaleSummTableRow> => ({
	accessorKey: key,
	header: () => headerCell(label, 'right'),
	cell: ({ row }) => numberCell(row.original[key] ?? 0),
	footer: ({ column }) => numberCell(sumColumn(column.getFacetedRowModel().rows, key)),
});

const createMoneyColumn = (key: NumericSaleSummColumnKey, label: string): TableColumn<SaleSummTableRow> => ({
	accessorKey: key,
	header: () => headerCell(label, 'right'),
	cell: ({ row }) => optionalMoneyCell(row.original[key], row.original.currency_code),
	footer: ({ column }) => moneyCell(sumColumn(column.getFacetedRowModel().rows, key), footerCurrency(column.getFacetedRowModel().rows)),
});

export function getSaleSummColumns(t: TranslateFn): TableColumn<SaleSummTableRow>[] {
	return [
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
			cell: ({ row }) => {
				const status = row.original.status;

				if (!status) return h('span', { class: 'text-muted' }, '-');

				return h(UBadge, { variant: 'subtle', color: statusColors[status] ?? 'neutral', class: 'capitalize' }, () => t(statusLabelKeys[status] ?? status));
			},
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
		createNumberColumn('total_txns', t('table.totalTransactions')),
		createNumberColumn('total_qty', t('table.totalItems')),
		createNumberColumn('total_voided_qty', t('pages.voidedLabel')),
	];
}
