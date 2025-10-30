import type { TableColumn } from '@nuxt/ui';

export const payment_type_group_columns: TableColumn<any>[] = [
	{
		accessorKey: 'index',
		header: 'No.',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('index'))]);
		},
	},
	{
		accessorKey: 'code',
		header: 'Group Code',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('code'))]);
		},
	},
	{
		accessorKey: 'desc',
		header: 'Description',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('desc'))]);
		},
	},
	{
		accessorKey: 'short_desc',
		header: 'Short Description',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('short_desc'))]);
		},
	},
];
