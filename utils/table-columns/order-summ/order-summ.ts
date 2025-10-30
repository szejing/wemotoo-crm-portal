import type { ColumnDef } from '@tanstack/vue-table';

export const order_summ_columns: ColumnDef<any>[] = [
	{
		accessorKey: 'currency_code',
		header: 'Currency',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('currency_code'))]);
		},
	},
	{
		accessorKey: 'status',
		header: 'Order Status',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('status'))]);
		},
	},
	{
		accessorKey: 'gross_amt',
		header: 'Gross Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('gross_amt'))]);
		},
	},
	{
		accessorKey: 'net_amt',
		header: 'Net Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('net_amt'))]);
		},
	},
	{
		accessorKey: 'total_orders',
		header: 'Total Orders',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_orders'))]);
		},
	},
	{
		accessorKey: 'total_qty',
		header: 'Total Qty',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_qty'))]);
		},
	},
	{
		accessorKey: 'total_voided_qty',
		header: 'Total Voided Qty',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_voided_qty'))]);
		},
	},
];
