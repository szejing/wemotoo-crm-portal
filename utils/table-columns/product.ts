import type { TableColumn } from '@nuxt/ui';
import type { Product } from '~/utils/types/product';
import type { PriceInput } from '../types/price';

export const product_columns: TableColumn<Product>[] = [
	{
		accessorKey: 'name',
		header: () => h('h1', 'Code & Name'),
		cell: ({ row }) => {
			const thumbnailUrl = row.original.thumbnail?.url;
			return h('div', { class: 'flex items-center gap-3' }, [
				thumbnailUrl
					? h('img', { src: thumbnailUrl, alt: row.original.name || 'Product thumbnail', class: 'w-10 h-10 rounded-md object-cover flex-shrink-0' })
					: null,
				h('div', [h('div', { class: 'font-bold text-neutral-900' }, row.original.code), h('div', { class: 'text-neutral-600' }, row.original.name)]),
			]);
		},
	},
	{
		accessorKey: 'orig_sell_price',
		header: () => h('div', 'Selling Price'),
		cell: ({ row }) => {
			const price_types: PriceInput[] | undefined = row.original.price_types;
			if (price_types) {
				if (price_types[0]?.orig_sell_price) {
					return h('div', [h('p', { class: 'text-neutral-900' }, `${formatCurrency(price_types[0]?.orig_sell_price, price_types[0]?.currency_code)}`)]);
				}
				return h('div', [h('p', { class: 'text-neutral-900' }, 'N/A')]);
			}
		},
	},
	{
		accessorKey: 'sale_price',
		header: () => h('div', 'Sale Price'),
		cell: ({ row }) => {
			const price_types: PriceInput[] | undefined = row.original.price_types;
			if (price_types) {
				if (price_types[0]?.sale_price) {
					return h('div', [h('p', { class: 'text-neutral-900' }, `${formatCurrency(price_types[0]?.sale_price, price_types[0]?.currency_code)}`)]);
				}
				return h('div', [h('p', { class: 'text-neutral-900' }, 'N/A')]);
			}
		},
	},
];
