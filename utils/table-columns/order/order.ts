import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';
import type { OrderHistory } from '~/repository/modules/order/models/response/get-orders.resp';

export const order_columns: TableColumn<OrderHistory>[] = [
	{
		accessorKey: 'index',
		header: () => h('h1', { class: 'text-neutral-400 dark:text-neutral-500' }, 'No.'),
		cell: ({ row }) => {
			return h('div', [h('p', row.index + 1)]);
		},
	},
	{
		accessorKey: 'biz_date',
		header: () => h('h1', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Date'),
		cell: ({ row }) => {
			return h('div', [h('p', row.original.biz_date)]);
		},
	},
	{
		accessorKey: 'order_no',
		header: () => h('h1', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Order No'),
		cell: ({ row }) => {
			return h('div', [h('p', row.original.order_no)]);
		},
	},
	{
		accessorKey: 'status',
		header: () => h('h1', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Status'),
		cell: ({ row }) => {
			const color = {
				[OrderStatus.COMPLETED]: 'success' as const,
				[OrderStatus.CANCELLED]: 'neutral' as const,
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
		header: () => h('h1', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Gross Amt'),
		cell: ({ row }) => {
			return h('div', [h('p', row.original.gross_amt)]);
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
		header: () => h('h1', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Tax Amt Exc'),
		cell: ({ row }) => {
			return h('div', [h('p', row.original.tax_amt_exc)]);
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
		header: () => h('h1', { class: 'text-neutral-400 dark:text-neutral-500' }, 'Net Amt'),
		cell: ({ row }) => {
			return h('div', [h('p', row.original.net_amt)]);
		},
		meta: {
			class: {
				th: 'text-center',
				td: 'text-center',
			},
		},
	},
];
