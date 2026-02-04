import { UBadge } from '#components';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { formatCurrency, SaleStatus } from 'wemotoo-common';
import type { SummSalePayment } from '~/utils/types/summ-sales';
import type { TableColumnsTranslate } from '../brand';

export function getSaleSummPaymentColumns(t: TableColumnsTranslate): TableColumn<SummSalePayment>[] {
	return [
		{
			accessorKey: 'currency_code',
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.currency')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('currency_code'))]);
			},
		},
		{
			accessorKey: 'payment_type_desc',
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.desc')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('payment_type_desc'))]);
			},
		},
		{
			accessorKey: 'status',
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.orderStatus')),
			cell: ({ row }) => {
				const color = {
					[SaleStatus.COMPLETED]: 'success' as const,
					[SaleStatus.CANCELLED]: 'neutral' as const,
					[SaleStatus.REFUNDED]: 'error' as const,
				}[row.original.status as SaleStatus];

				const value = {
					[SaleStatus.COMPLETED]: t('options.completed'),
					[SaleStatus.CANCELLED]: t('options.cancelled'),
					[SaleStatus.REFUNDED]: t('options.refunded'),
				}[row.original.status as SaleStatus];

				return h(UBadge, { variant: 'subtle', color }, () => value);
			},
		},

		{
			accessorKey: 'void_amt',
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.voidAmt')),
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
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.paymentAmt')),
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
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.totalTxns')),
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
