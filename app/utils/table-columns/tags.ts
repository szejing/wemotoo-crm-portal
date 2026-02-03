import type { TableColumn } from '@nuxt/ui';
import type { Tag } from '~/utils/types/tag';
import type { TableColumnsTranslate } from './brand';

export function getTagColumns(t: TableColumnsTranslate): TableColumn<Tag>[] {
	return [
		{
			accessorKey: 'value',
			header: () => h('h1', t('table.description')),
			cell: ({ row }) => {
				return h('div', [h('div', { class: 'font-bold text-neutral-900' }, row.original.value)]);
			},
		},
		{
			accessorKey: 'total_items',
			header: () => h('h1', { class: 'flex justify-end w-full' }, [h('h1', t('table.noOfItems'))]),
			cell: ({ row }) => {
				return h('div', { class: 'flex justify-end w-full' }, [
					h('div', { class: 'text-center', style: 'min-width: 90px' }, [h('p', { class: 'text-neutral-900' }, row.original.total_products)]),
				]);
			},
		},
	];
}
