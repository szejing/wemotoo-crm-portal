import { h } from 'vue';
import { OrderItemStatus, SaleStatus } from 'wemotoo-common';
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { SummSaleItem } from '~/utils/types/summ-sales';
import { UBadge } from '#components';

export const sale_summ_item_columns: TableColumn<SummSaleItem>[] = [
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
				[SaleStatus.COMPLETED]: 'success' as const,
				[SaleStatus.CANCELLED]: 'neutral' as const,
				[SaleStatus.REFUNDED]: 'error' as const,
			}[row.original.status as SaleStatus];

			const value = {
				[SaleStatus.COMPLETED]: 'COMPLETED',
				[SaleStatus.CANCELLED]: 'CANCELLED',
				[SaleStatus.REFUNDED]: 'REFUNDED',
			}[row.original.status as SaleStatus];

			return h(UBadge, { variant: 'subtle', color }, () => value);
		},
	},

	{
		accessorKey: 'item_status',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Status'),
		cell: ({ row }) => {
			const color = {
				[OrderItemStatus.ACTIVE]: 'success' as const,
				[OrderItemStatus.REFUNDED]: 'error' as const,
				[OrderItemStatus.VOIDED]: 'error' as const,
			}[row.getValue('item_status') as OrderItemStatus];

			const value = {
				[OrderItemStatus.ACTIVE]: 'ACTIVE',
				[OrderItemStatus.REFUNDED]: 'REFUNDED',
				[OrderItemStatus.VOIDED]: 'VOIDED',
			}[row.getValue('item_status') as OrderItemStatus];

			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => value);
		},
	},
	{
		accessorKey: 'total_qty',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Qty'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleItem>) => acc + row.original.total_qty, 0);

			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, total)]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', row.getValue('total_qty'))]);
		},
	},
	{
		accessorKey: 'gross_amt',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Gross Amt'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleItem>) => acc + row.original.gross_amt, 0);

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
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleItem>) => acc + row.original.net_amt, 0);

			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, column.getFacetedRowModel().rows[0]?.original.currency_code ?? 'MYR')),
			]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', formatCurrency(row.original.net_amt, row.original.currency_code))]);
		},
	},
];
