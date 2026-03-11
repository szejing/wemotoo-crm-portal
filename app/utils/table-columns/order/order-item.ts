import type { ColumnDef } from '@tanstack/vue-table';
import { formatCurrency } from 'wemotoo-common';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getOrderItemColumns(t: TranslateFn): ColumnDef<any>[] {
	return [
		{
			accessorKey: 'prod_code',
			header: ({ column }) => getSortableHeader(column, t('table.prodCode')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('prod_code'))]);
			},
		},
		{
			accessorKey: 'prod_name',
			header: ({ column }) => getSortableHeader(column, t('table.prodName')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('prod_name'))]);
			},
		},
		{
			accessorKey: 'status',
			header: ({ column }) => getSortableHeader(column, t('table.itemStatus')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('status'))]);
			},
		},
		{
			accessorKey: 'order_qty',
			header: ({ column }) => getSortableHeader(column, t('table.qty')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('order_qty'))]);
			},
		},
		{
			accessorKey: 'gross_amt',
			header: ({ column }) => getSortableHeader(column, t('table.grossAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(row.getValue('gross_amt'), row.getValue('currency_code'))),
				]);
			},
		},
		{
			accessorKey: 'net_amt',
			header: ({ column }) => getSortableHeader(column, t('table.netAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('net_amt'))]);
			},
		},
		{
			accessorKey: 'total_amt',
			header: ({ column }) => getSortableHeader(column, t('table.totalAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_amt'))]);
			},
		},
	];
}
