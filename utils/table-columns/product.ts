import type { TableColumn } from '@nuxt/ui';
import type { Product } from '~/utils/types/product';

export const product_columns: TableColumn<Product>[] = [
	{
		accessorKey: 'name',
		header: () => h('div', { class: 'text-left' }, 'Code & Name'),
	},
	{
		accessorKey: 'orig_sell_price',
		header: 'Selling Price',
		cell: ({ row }) => {
			return h('div', { class: 'text-left' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('orig_sell_price'))]);
		},
	},
	{
		accessorKey: 'sale_price',
		header: () => h('div', { class: 'text-right' }, 'Sale Price'),
		cell: ({ row }) => {
			return h('div', { class: 'text-left' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('sale_price'))]);
		},
	},
];
