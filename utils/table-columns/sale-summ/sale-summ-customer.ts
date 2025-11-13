import { UBadge } from '#components';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { h } from 'vue';
import { SaleStatus } from 'wemotoo-common';
import type { SummSaleCustomer } from '~/utils/types/summ-sales';

export const sale_summ_customer_columns: TableColumn<SummSaleCustomer>[] = [
	{
		accessorKey: 'customer',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Customer'),
		cell: ({ row }) => {
			return h('div', [
				h('div', { class: 'font-bold text-neutral-900' }, row.original.customer_no),
				h('div', { class: 'text-neutral-600' }, row.original.customer_name),
			]);
		},
	},
	{
		accessorKey: 'status',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Status'),
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

			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => value);
		},
	},

	{
		accessorKey: 'total_txns',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Total Txns'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleCustomer>) => acc + row.original.total_txns, 0);

			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, total)]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', row.original.total_txns)]);
		},
	},
	{
		accessorKey: 'total_qty',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Total Qty'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleCustomer>) => acc + row.original.total_qty, 0);

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
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleCustomer>) => acc + row.original.gross_amt, 0);

			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, column.getFacetedRowModel().rows[0]?.original.currency_code)),
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
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleCustomer>) => acc + row.original.net_amt, 0);

			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, column.getFacetedRowModel().rows[0]?.original.currency_code)),
			]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', formatCurrency(row.original.net_amt, row.original.currency_code))]);
		},
	},
];
