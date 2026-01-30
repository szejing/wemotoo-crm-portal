/* eslint-disable indent */
import type { TableColumn } from '@nuxt/ui';
import type { Product } from '~/utils/types/product';
import type { PriceInput } from '../types/price';
import { UBadge, UCheckbox } from '#components';
import { formatCurrency } from 'wemotoo-common';

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
					: h('img', {
							src: '/svg/product-holder.svg',
							alt: row.original.name || 'Product thumbnail',
							class: 'w-10 h-10 rounded-md object-cover flex-shrink-0',
						}),
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
		accessorKey: 'type',
		header: () => h('div', 'Type'),
		cell: ({ row }) => {
			const productTypeStore = useProductTypeStore();
			const typeId = row.original.type;
			const typeLabel = productTypeStore.prod_types.find((pt) => pt.id === typeId)?.value ?? (typeId != null ? `Type ${typeId}` : '—');
			const metadata = row.original.metadata as { duration?: string } | undefined;
			const duration = metadata?.duration;
			const isMaintenance = typeId === 2 || (typeof typeLabel === 'string' && typeLabel.toLowerCase().includes('maintenance'));
			const children: ReturnType<typeof h>[] = [h('div', { class: 'text-neutral-900 font-bold capitalize' }, typeLabel)];
			if (isMaintenance && duration) {
				children.push(h('div', { class: 'text-neutral-600 text-sm' }, `Duration: ${duration}`));
			}
			return h('div', { class: 'space-y-0.5' }, children);
		},
	},
	{
		accessorKey: 'price_types',
		header: () => h('div', 'Price'),
		cell: ({ row }) => {
			const price_types: PriceInput[] | undefined = row.original.price_types;
			const pt = price_types?.[0];
			if (!pt) return null;
			const selling = pt.orig_sell_price != null ? formatCurrency(pt.orig_sell_price, pt.currency_code) : 'N/A';
			const sale = pt.sale_price != null ? formatCurrency(pt.sale_price, pt.currency_code) : 'N/A';
			return h('div', { class: 'space-y-0.5' }, [
				h('div', { class: 'text-neutral-900' }, ['Selling: ', selling]),
				h('div', { class: 'text-neutral-600 text-sm' }, ['Sale: ', sale]),
			]);
		},
	},
	{
		accessorKey: 'is_active',
		header: () => h('div', { class: 'text-center' }, 'Active'),
		cell: ({ row }) => {
			const productStore = useProductStore();
			return h(
				'div',
				{
					class: 'flex justify-center',
					onClick: (e: Event) => e.stopPropagation(),
				},
				[
					h(UCheckbox, {
						modelValue: row.original.is_active,
						'onUpdate:modelValue': () => productStore.toggleProductActive(row.original),
						'aria-label': 'Active',
					}),
				],
			);
		},
	},
];
