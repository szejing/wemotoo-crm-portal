import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';
import type { OrderHistory } from '~/utils/types/order-history';

export const order_columns: TableColumn<OrderHistory>[] = [
	{
		accessorKey: 'index',
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'No.'),
		cell: ({ row }) => {
			return h('div', [h('p', row.index + 1)]);
		},
	},
	{
		accessorKey: 'biz_date',
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Date'),
		cell: ({ row }) => {
			return h('div', [h('p', row.original.biz_date)]);
		},
	},
	{
		accessorKey: 'order_no',
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Order No'),
		cell: ({ row }) => {
			return h('div', [h('p', row.original.transaction_no)]);
		},
	},
	{
		accessorKey: 'customer',
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Customer'),

		cell: ({ row }) => {
			return h('div', { class: 'flex flex-col gap-1' }, [
				h('h3', { class: 'text-neutral-800 font-bold' }, `${row.original.customer?.customer_no} | ${row.original.customer?.name}`),
				h('h5', { class: 'text-neutral-400' }, row.original.customer?.email_address),
			]);
		},
	},
	{
		accessorKey: 'status',
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Status'),
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
				[OrderStatus.COMPLETED]: 'COMPLETED',
				[OrderStatus.CANCELLED]: 'CANCELLED',
				[OrderStatus.REFUNDED]: 'REFUNDED',
				[OrderStatus.PENDING_PAYMENT]: 'PENDING PAYMENT',
				[OrderStatus.PROCESSING]: 'PROCESSING',
				[OrderStatus.REQUIRES_ACTION]: 'REQUIRES ACTION',
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
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Gross Amt'),
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
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Tax Amt Exc'),
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
		header: () => h('p', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Net Amt'),
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
