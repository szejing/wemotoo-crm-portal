import { h } from 'vue';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { formatCurrency, getFormattedDate, OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';
import { getSortableHeader } from '../sortable';
import type { SummCustomerRow, SummCustomerVariant, TranslateFn } from './types';

const SUMM_CUSTOMER_BASE_COLUMN_LABELS = {
	biz_date: 'table.date',
	customer: 'table.customer',
	gross_amt: 'table.grossAmt',
	net_amt: 'table.netAmt',
} as const;

export function getSummCustomerColumnLabels(variant: SummCustomerVariant) {
	if (variant === 'order') {
		return {
			...SUMM_CUSTOMER_BASE_COLUMN_LABELS,
			status: 'table.orderStatus',
		} as const;
	}

	return {
		...SUMM_CUSTOMER_BASE_COLUMN_LABELS,
		status: 'table.status',
		total_txns: 'table.totalTxns',
		total_qty: 'table.totalQty',
	} as const;
}

const statusColors: Partial<Record<OrderStatus, 'success' | 'error' | 'info' | 'warning'>> = {
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

const statusCell = (t: TranslateFn, status: OrderStatus) => {
	const color = statusColors[status];
	const value = statusLabelKeys[status];

	return h(UBadge, { variant: 'subtle', color }, () => (value ? t(value) : status));
};

const moneyFooter = (column: { getFacetedRowModel: () => { rows: TableRow<SummCustomerRow>[] } }, key: 'gross_amt' | 'net_amt') => {
	const rows = column.getFacetedRowModel().rows;
	const total = rows.reduce((acc, row) => acc + row.original[key], 0);

	return h('div', { class: 'flex items-center gap-2' }, [
		h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, rows[0]?.original.currency_code)),
	]);
};

const countFooter = (column: { getFacetedRowModel: () => { rows: TableRow<SummCustomerRow>[] } }, key: 'total_txns' | 'total_qty') => {
	const total = column.getFacetedRowModel().rows.reduce((acc, row) => acc + (row.original[key] ?? 0), 0);

	return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, total)]);
};

export function getSummCustomerColumns<T extends SummCustomerRow>(t: TranslateFn, variant: SummCustomerVariant): TableColumn<T>[] {
	const statusLabel = variant === 'order' ? t('table.orderStatus') : t('table.status');

	const columns: TableColumn<SummCustomerRow>[] = [
		{
			accessorKey: 'biz_date',
			header: ({ column }) => getSortableHeader(column, t('table.date')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, getFormattedDate(row.original.biz_date))]);
			},
		},
		{
			accessorKey: 'customer',
			header: ({ column }) => getSortableHeader(column, t('table.customer')),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-bold text-neutral-900' }, row.original.customer_no),
					h('div', { class: 'text-neutral-600' }, row.original.customer_name),
				]);
			},
		},
		{
			accessorKey: 'status',
			header: ({ column }) => getSortableHeader(column, statusLabel),
			cell: ({ row }) => statusCell(t, row.original.status),
		},
	];

	if (variant === 'sale') {
		columns.push(
			{
				accessorKey: 'total_txns',
				header: ({ column }) => getSortableHeader(column, t('table.totalTxns')),
				footer: ({ column }) => countFooter(column, 'total_txns'),
				cell: ({ row }) => {
					return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.original.total_txns ?? 0)]);
				},
			},
			{
				accessorKey: 'total_qty',
				header: ({ column }) => getSortableHeader(column, t('table.totalQty')),
				footer: ({ column }) => countFooter(column, 'total_qty'),
				cell: ({ row }) => {
					return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.original.total_qty ?? 0)]);
				},
			},
		);
	}

	columns.push(
		{
			accessorKey: 'gross_amt',
			header: ({ column }) => getSortableHeader(column, t('table.grossAmt')),
			footer: ({ column }) => moneyFooter(column, 'gross_amt'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(row.original.gross_amt, row.original.currency_code)),
				]);
			},
		},
		{
			accessorKey: 'net_amt',
			header: ({ column }) => getSortableHeader(column, t('table.netAmt')),
			footer: ({ column }) => moneyFooter(column, 'net_amt'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(row.original.net_amt, row.original.currency_code)),
				]);
			},
		},
	);

	return columns as TableColumn<T>[];
}
