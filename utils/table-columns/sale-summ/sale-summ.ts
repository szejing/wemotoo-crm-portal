import type { ColumnDef } from '@tanstack/vue-table';

export const sale_summ_columns: ColumnDef<any>[] = [
	{
		accessorKey: 'currency_code',
		header: 'Currency',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'gross_amt',
		header: 'Gross Amt',
		meta: {
			class: 'text-center',
		},
	},
	{
		accessorKey: 'net_amt',
		header: 'Net Amt',
		meta: {
			class: 'text-center',
		},
	},
	{
		accessorKey: 'total_txns',
		header: 'Total Txns',
		meta: {
			class: 'text-center',
		},
	},
	{
		accessorKey: 'total_qty',
		header: 'Total Qty',
		meta: {
			class: 'text-center',
		},
	},
	{
		accessorKey: 'total_voided_qty',
		header: 'Total Voided Qty',
		meta: {
			class: 'text-center',
		},
	},
];
