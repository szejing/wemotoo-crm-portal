import type { TableColumn } from '@nuxt/ui';
import type { Category } from '~/utils/types/category';

export const category_columns: TableColumn<Category>[] = [
	{
		accessorKey: 'code',
		header: 'Code',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('code'))]);
		},
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('description'))]);
		},
	},
	{
		accessorKey: 'total_items',
		header: 'No of Items',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_items'))]);
		},
	},
];
