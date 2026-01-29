import type { TableColumn } from '@nuxt/ui';

export const payment_type_group_columns: TableColumn<any>[] = [
	{
		accessorKey: 'index',
		header: () => h('div', { class: 'text-neutral-400' }, 'No.'),
		cell: ({ row }) => {
			return h('p', { class: 'text-neutral-900' }, row.index + 1);
		},
	},
	{
		accessorKey: 'code',
		header: () => h('div', { class: 'text-neutral-400' }, 'Group Code'),
		cell: ({ row }) => {
			return h('div', { class: 'flex flex-col gap-1' }, [
				h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
				h('h5', { class: 'text-neutral-400' }, row.original.short_desc),
			]);
		},
	},
];
