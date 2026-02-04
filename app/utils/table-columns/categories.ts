import type { TableColumn } from '@nuxt/ui';
import type { Category } from '~/utils/types/category';
import type { TableColumnsTranslate } from './brand';

export function getCategoryColumns(t: TableColumnsTranslate): TableColumn<Category>[] {
	return [
		{
			accessorKey: 'code',
			header: () => h('h1', t('table.code')),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-bold text-neutral-900' }, row.original.code),
					h('div', { class: 'text-neutral-600' }, row.original.description),
				]);
			},
		},
		{
			accessorKey: 'total_items',
			header: () => h('div', { class: 'flex justify-end w-full' }, [h('h1', t('table.noOfItems'))]),
			cell: ({ row }) => {
				return h('div', { class: 'flex justify-end w-full' }, [
					h('div', { class: 'text-center', style: 'min-width: 90px' }, [h('p', { class: 'text-neutral-900' }, row.original.total_products)]),
				]);
			},
		},
	];
}
