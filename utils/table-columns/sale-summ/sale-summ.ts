import { UBadge } from '#components';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { SaleStatus } from 'wemotoo-common';
import type { SummSaleBill } from '~/utils/types/summ-sales';

export const sale_summ_columns: TableColumn<SummSaleBill>[] = [
	{
		accessorKey: 'currency_code',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Currency'),
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('currency_code'))]);
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
		accessorKey: 'gross_amt',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Gross Amt'),
		footer: ({ column }) => {
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleBill>) => acc + row.original.gross_amt, 0);

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
			const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummSaleBill>) => acc + row.original.net_amt, 0);

			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, column.getFacetedRowModel().rows[0]?.original.currency_code)),
			]);
		},
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', formatCurrency(row.original.net_amt, row.original.currency_code))]);
		},
	},
	{
		accessorKey: 'total_txns',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Total Orders'),
		cell: ({ row }) => {
			console.log(row);
			return h('div', { class: 'flex items-center gap-2' }, [h('p', row.getValue('total_txns'))]);
		},
	},
	{
		accessorKey: 'total_qty',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Total Items'),
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', row.getValue('total_qty'))]);
		},
	},
];
