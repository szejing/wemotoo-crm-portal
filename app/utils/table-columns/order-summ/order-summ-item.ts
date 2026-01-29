import type { TableColumn, TableRow } from '@nuxt/ui';
import { formatCurrency, OrderItemStatus, OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';
import type { SummOrderItem } from '~/utils/types/summ-orders';

export const order_summ_item_columns: TableColumn<SummOrderItem>[] = [
	{
		accessorKey: 'prod_code',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Product'),
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('prod_code'))]);
		},
	},
	{
		accessorKey: 'status',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Order Status'),
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
				[OrderStatus.COMPLETED]: 'COMPLETED',
				[OrderStatus.CANCELLED]: 'CANCELLED',
				[OrderStatus.REFUNDED]: 'REFUNDED',
				[OrderStatus.PENDING_PAYMENT]: 'PENDING PAYMENT',
				[OrderStatus.PROCESSING]: 'PROCESSING',
				[OrderStatus.REQUIRES_ACTION]: 'REQUIRES ACTION',
			}[row.original.status as OrderStatus];

			return h(UBadge, { variant: 'subtle', color }, () => value);
		},
	},

	{
		accessorKey: 'item_status',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Item Status'),
		cell: ({ row }) => {
			const color = {
				[OrderItemStatus.ACTIVE]: 'success' as const,
				[OrderItemStatus.REFUNDED]: 'error' as const,
				[OrderItemStatus.VOIDED]: 'error' as const,
			}[row.original.item_status as OrderItemStatus];

			const value = {
				[OrderItemStatus.ACTIVE]: 'ACTIVE',
				[OrderItemStatus.REFUNDED]: 'REFUNDED',
				[OrderItemStatus.VOIDED]: 'VOIDED',
			}[row.original.item_status as OrderItemStatus];

			return h(UBadge, { variant: 'subtle', color }, () => value);
		},
	},
	{
		accessorKey: 'total_qty',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Qty'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummOrderItem>) => acc + row.original.total_qty, 0);

			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, total)]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', row.original.total_qty)]);
		},
	},
	{
		accessorKey: 'gross_amt',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Gross Amt'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummOrderItem>) => acc + row.original.gross_amt, 0);

			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, column.getFacetedRowModel().rows[0]?.original.currency_code ?? 'MYR')),
			]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', formatCurrency(row.original.gross_amt, row.original.currency_code))]);
		},
	},
	{
		accessorKey: 'net_amt',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Net Amt'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummOrderItem>) => acc + row.original.net_amt, 0);

			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, column.getFacetedRowModel().rows[0]?.original.currency_code ?? 'MYR')),
			]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', formatCurrency(row.original.net_amt, row.original.currency_code))]);
		},
	},
];
