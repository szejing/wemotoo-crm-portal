import { UBadge } from '#components';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { formatCurrency, OrderStatus } from 'wemotoo-common';
import type { SummSalePayment } from '~/utils/types/summ-sales';
import { getSortableHeader } from '../sortable';
import type { TranslateFn } from './types';

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

export const SUMM_PAYMENT_COLUMN_LABELS = {
	payment_type_desc: 'table.desc',
	status: 'table.orderStatus',
	payment_amt: 'table.paymentAmt',
	total_txns: 'table.totalTxns',
} as const;

export function getSummPaymentColumns(t: TranslateFn): TableColumn<SummSalePayment>[] {
	return [
		{
			accessorKey: 'payment_type_desc',
			header: ({ column }) => getSortableHeader(column, t('table.desc')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('payment_type_desc'))]);
			},
		},
		{
			accessorKey: 'status',
			header: ({ column }) => getSortableHeader(column, t('table.orderStatus')),
			cell: ({ row }) => {
				const status = row.original.status as OrderStatus;
				const color = statusColors[status];
				const labelKey = statusLabelKeys[status];

				return h(UBadge, { variant: 'subtle', color }, () => (labelKey ? t(labelKey) : status));
			},
		},
		{
			accessorKey: 'payment_amt',
			header: ({ column }) => getSortableHeader(column, t('table.paymentAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(row.original.payment_amt, row.original.currency_code)),
				]);
			},
			footer: ({ column }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h(
						'p',
						{ class: 'font-medium text-neutral-900' },
						formatCurrency(
							column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSalePayment>) => acc + row.original.payment_amt, 0),
							column.getFacetedRowModel().rows[0]?.original.currency_code,
						),
					),
				]);
			},
		},
		{
			accessorKey: 'total_txns',
			header: ({ column }) => getSortableHeader(column, t('table.totalTxns')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_txns'))]);
			},
			footer: ({ column }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h(
						'p',
						{ class: 'font-medium text-neutral-900' },
						column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSalePayment>) => acc + row.original.total_txns, 0),
					),
				]);
			},
		},
	];
}
