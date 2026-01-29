import type { ColumnDef } from '@tanstack/vue-table';

export const payment_type_columns: ColumnDef<any>[] = [
	{
		accessorKey: 'code',
		header: 'Code',
	},
	{
		accessorKey: 'desc',
		header: 'Description',
	},
	{
		accessorKey: 'short_desc',
		header: 'Short Description',
	},
];
