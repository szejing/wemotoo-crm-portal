import { UBadge } from '#components';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { formatCurrency, OrderStatus } from 'wemotoo-common';
import type { SummSalePayment } from '~/utils/types/summ-sales';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getSaleSummPaymentColumns(t: TranslateFn): TableColumn<SummSalePayment>[] {
	return [
		// {
		// 	accessorKey: 'currency_code',
		// 	header: ({ column }) => getSortableHeader(column, t('table.currency')),
		// 	cell: ({ row }) => {
		// 		return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('currency_code'))]);
		// 	},
		// },
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
				const color = {
					[OrderStatus.COMPLETED]: 'success' as const,
					[OrderStatus.CANCELLED]: 'neutral' as const,
					[OrderStatus.REFUNDED]: 'error' as const,
					[OrderStatus.PENDING_PAYMENT]: 'info' as const,
					[OrderStatus.PROCESSING]: 'info' as const,
					[OrderStatus.REQUIRES_ACTION]: 'warning' as const,
				}[row.original.status as OrderStatus];

				const value = {
					[OrderStatus.COMPLETED]: t('options.completed'),
					[OrderStatus.CANCELLED]: t('options.cancelled'),
					[OrderStatus.REFUNDED]: t('options.refunded'),
					[OrderStatus.PENDING_PAYMENT]: t('options.pendingPayment'),
					[OrderStatus.PROCESSING]: t('options.processing'),
					[OrderStatus.REQUIRES_ACTION]: t('options.requiresAction'),
				}[row.original.status as OrderStatus];

				return h(UBadge, { variant: 'subtle', color }, () => value);
			},
		},

		{
			accessorKey: 'void_amt',
			header: ({ column }) => getSortableHeader(column, t('table.voidAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(row.original.void_amt ?? 0, row.original.currency_code)),
				]);
			},
			footer: ({ column }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h(
						'p',
						{ class: 'font-medium text-neutral-900' },
						formatCurrency(
							column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSalePayment>) => acc + (row.original.void_amt ?? 0), 0),
							column.getFacetedRowModel().rows[0]?.original.currency_code,
						),
					),
				]);
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
