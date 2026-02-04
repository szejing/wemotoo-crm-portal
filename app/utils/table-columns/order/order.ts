import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { formatCurrency, OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';
import type { OrderHistory } from '~/utils/types/order-history';
import type { TableColumnsTranslate } from '../brand';

export function getOrderColumns(t: TableColumnsTranslate): TableColumn<OrderHistory>[] {
	return [
		{
			accessorKey: 'index',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.no')),
			cell: ({ row }) => {
				return h('div', [h('p', row.index + 1)]);
			},
		},
		{
			accessorKey: 'biz_date',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.date')),
			cell: ({ row }) => {
				return h('div', [h('p', row.original.biz_date)]);
			},
		},
		{
			accessorKey: 'order_no',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.orderNo')),
			cell: ({ row }) => {
				return h('div', [h('p', row.original.transaction_no)]);
			},
		},
		{
			accessorKey: 'customer',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.customer')),

			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, `${row.original.customer?.customer_no} | ${row.original.customer?.name}`),
					h('h5', { class: 'text-neutral-400' }, row.original.customer?.email_address),
				]);
			},
		},
		{
			accessorKey: 'status',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.status')),
			cell: ({ row }) => {
				const color = {
					[OrderStatus.COMPLETED]: 'success' as const,
					[OrderStatus.CANCELLED]: 'error' as const,
					[OrderStatus.REFUNDED]: 'error' as const,
					[OrderStatus.PENDING_PAYMENT]: 'info' as const,
					[OrderStatus.PROCESSING]: 'info' as const,
					[OrderStatus.REQUIRES_ACTION]: 'warning' as const,
				}[row.original.status as string];

				const value = {
					[OrderStatus.COMPLETED]: t('options.completed'),
					[OrderStatus.CANCELLED]: t('options.cancelled'),
					[OrderStatus.REFUNDED]: t('options.refunded'),
					[OrderStatus.PENDING_PAYMENT]: t('options.pendingPayment'),
					[OrderStatus.PROCESSING]: t('options.processing'),
					[OrderStatus.REQUIRES_ACTION]: t('options.requiresAction'),
				}[row.original.status as string];

				return h(UBadge, { class: 'capitalize ', variant: 'subtle', color }, () => value);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			accessorKey: 'gross_amt',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.grossAmt')),
			cell: ({ row }) => {
				return h('div', [h('p', formatCurrency(row.original.gross_amt ?? 0, row.original.currency.code))]);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			accessorKey: 'tax_amt_exc',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.taxAmtExc')),
			cell: ({ row }) => {
				return h('div', [h('p', formatCurrency(row.original.tax_amt_exc ?? 0, row.original.currency.code))]);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			accessorKey: 'net_amt',
			header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, t('table.netAmt')),
			cell: ({ row }) => {
				return h('div', [h('p', formatCurrency(row.original.net_amt ?? 0, row.original.currency.code))]);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
	];
}
