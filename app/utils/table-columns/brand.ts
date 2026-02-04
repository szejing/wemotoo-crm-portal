import type { TableColumn } from '@nuxt/ui';
import type { Brand } from '~/utils/types/brand';

export type TableColumnsTranslate = (key: string) => string;

export function getBrandColumns(t: TableColumnsTranslate): TableColumn<Brand>[] {
	return [
		{
			accessorKey: 'code',
			header: t('table.code'),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-bold text-neutral-900' }, row.original.code),
					h('div', { class: 'text-neutral-600' }, row.original.description),
				]);
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
