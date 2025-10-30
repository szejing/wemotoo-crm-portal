import type { TableColumn } from '@nuxt/ui';
import type { Tag } from '~/utils/types/tag';

export const tag_columns: TableColumn<Tag>[] = [
	{
		accessorKey: 'value',
		header: 'Description',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('value'))]);
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
