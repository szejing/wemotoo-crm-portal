import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';
import type { OrderHistory } from '~/repository/modules/order/models/response/get-orders.resp';

export const order_columns: TableColumn<OrderHistory>[] = [
	{
		accessorKey: 'index',
		header: () => h('h1', 'No.'),
		cell: ({ row }) => {
			return h('div', [h('p', { class: 'text-neutral-900' }, row.index + 1)]);
		},
	},
	{
		accessorKey: 'biz_date',
		header: () => h('h1', 'Date'),
		cell: ({ row }) => {
			return h('div', [h('p', { class: 'text-neutral-900' }, row.original.biz_date)]);
		},
	},
	{
		accessorKey: 'order_no',
		header: () => h('h1', 'Order No'),
		cell: ({ row }) => {
			return h('div', [h('p', { class: 'text-neutral-900' }, row.original.order_no)]);
		},
	},
	{
		accessorKey: 'status',
		header: () => h('h1', 'Status'),
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
		header: () => h('h1', 'Gross Amt'),
		cell: ({ row }) => {
			return h('div', [h('p', { class: 'text-neutral-900' }, row.original.gross_amt)]);
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
		header: () => h('h1', 'Tax Amt Exc'),
		cell: ({ row }) => {
			return h('div', [h('p', { class: 'text-neutral-900' }, row.original.tax_amt_exc)]);
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
		header: () => h('h1', 'Net Amt'),
		cell: ({ row }) => {
			return h('div', [h('p', { class: 'text-neutral-900' }, row.original.net_amt)]);
		},
		meta: {
			class: {
				th: 'text-center',
				td: 'text-center',
			},
		},
	},
];
