/* eslint-disable indent */
import type { TableColumn } from '@nuxt/ui';
import type { Product } from '~/utils/types/product';
import type { PriceInput } from '../types/price';
import { UBadge } from '#components';

export const product_columns: TableColumn<Product>[] = [
	{
		accessorKey: 'name',
		header: () => h('h1', 'Code & Name'),
		cell: ({ row }) => {
			const thumbnailUrl = row.original.thumbnail?.url;
			const variants = row.original.variants;

			const variantBadge =
				variants && variants.length > 0
					? variants.map((variant) => h(UBadge, { class: 'capitalize', variant: 'subtle', color: 'info' }, `${variant.name || variant.variant_code}`))
					: [];

			const children: any[] = [
				thumbnailUrl
					? h('img', { src: thumbnailUrl, alt: row.original.name || 'Product thumbnail', class: 'w-10 h-10 rounded-md object-cover flex-shrink-0' })
					: null,
				h('div', { class: 'flex-1 min-w-0' }, [
					h('div', { class: 'font-bold text-neutral-900' }, row.original.code),
					h('div', { class: 'text-neutral-600' }, row.original.name),
					variantBadge.length > 0 ? h('div', { class: 'mt-1 flex flex-wrap items-center gap-1' }, [...variantBadge]) : null,
				]),
			];

			return h('div', { class: 'flex items-start gap-3' }, children);
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
