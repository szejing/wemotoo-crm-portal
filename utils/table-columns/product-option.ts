import type { TableColumn } from '@nuxt/ui';
import type { ProductOption } from '~/utils/types/product-option';

export const product_option_columns: TableColumn<ProductOption>[] = [
	{
		accessorKey: 'name',
		header: () => h('h1', 'Name'),
		cell: ({ row }) => {
			return h('div', [h('div', { class: 'font-bold text-neutral-900' }, row.original.name)]);
		},
	},
	{
		accessorKey: 'values',
		header: () => h('h1', { class: 'flex justify-center w-full' }, [h('h1', 'Values')]),
		cell: ({ row }) => {
			return h('div', { class: 'flex justify-center w-full' }, [
				h('div', { class: 'text-center', style: 'min-width: 90px' }, [
					h('p', { class: 'text-neutral-900' }, row.original.values.map((value) => value.value).join(', ')),
				]),
			]);
		},
	},
];
