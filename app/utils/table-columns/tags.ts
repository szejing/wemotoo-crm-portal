import type { TableColumn } from '@nuxt/ui';
import type { Tag } from '~/utils/types/tag';

export const tag_columns: TableColumn<Tag>[] = [
	{
		accessorKey: 'value',
		header: () => h('h1', 'Description'),
		cell: ({ row }) => {
			return h('div', [h('div', { class: 'font-bold text-neutral-900' }, row.original.value)]);
		},
	},
	{
		accessorKey: 'total_items',
		header: () => h('h1', { class: 'flex justify-end w-full' }, [h('h1', 'No of Items')]),
		cell: ({ row }) => {
			return h('div', { class: 'flex justify-end w-full' }, [
				h('div', { class: 'text-center', style: 'min-width: 90px' }, [h('p', { class: 'text-neutral-900' }, row.original.total_products)]),
			]);
		},
	},
];
