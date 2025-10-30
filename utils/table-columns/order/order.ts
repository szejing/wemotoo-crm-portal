import type { ColumnDef } from '@tanstack/vue-table';

export const order_columns: ColumnDef<any>[] = [
	{
		accessorKey: 'index',
		header: 'No.',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('index'))]);
		},
	},
	{
		accessorKey: 'biz_date',
		header: 'Date',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('biz_date'))]);
		},
	},
	{
		accessorKey: 'order_no',
		header: 'Order No',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('order_no'))]);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('status'))]);
		},
	},
	// {
	// 	accessorKey: 'currency_code',
	// 	header: 'Currency',
	// },
	{
		accessorKey: 'total_qty',
		header: 'Order Qty',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_qty'))]);
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
		accessorKey: 'tax_amt_exc',
		header: 'Tax Amt Exc',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('tax_amt_exc'))]);
		},
	},
	// {
	// 	accessorKey: 'tax_amt_inc',
	// 	header: 'Tax Amt Inc',
	// },
	{
		accessorKey: 'net_amt',
		header: 'Net Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('net_amt'))]);
		},
	},
	// {
	// 	accessorKey: 'disc_amt',
	// 	header: 'Discount Amt',
	// },

	// {
	// 	accessorKey: 'void_amt',
	// 	header: 'Void Amt',
	// },
	// {
	// 	accessorKey: 'total_voided_qty',
	// 	header: 'Total Voided Qty',
	// },
];
