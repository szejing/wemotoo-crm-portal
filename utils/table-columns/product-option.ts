import type { ColumnDef } from '@tanstack/vue-table';

export const product_option_columns: ColumnDef<any>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('name'))]);
		},
	},
	{
		accessorKey: 'values',
		header: 'Values',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('values'))]);
		},
	},
];
