/* eslint-disable indent */
import type { TableColumn } from '@nuxt/ui';
import type { Product } from '~/utils/types/product';
import type { PriceInput } from '../types/price';
import { UBadge, USwitch } from '#components';
import { formatCurrency } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export function getProductColumns(t: TranslateFn): TableColumn<Product>[] {
	return [
		{
			accessorKey: 'name',
			header: () => h('h1', t('table.codeAndName')),
			cell: ({ row }) => {
				const thumbnailUrl = row.original.thumbnail?.url;
				const variants = row.original.variants;

				const variantBadge =
					variants && variants.length > 0
						? variants.map((variant) => h(UBadge, { class: 'capitalize', variant: 'subtle', color: 'info' }, `${variant.name || variant.variant_code}`))
						: [];

				const children: any[] = [
					thumbnailUrl
						? h('img', { src: thumbnailUrl, alt: row.original.name || t('table.productThumbnail'), class: 'w-10 h-10 rounded-md object-cover flex-shrink-0' })
						: h('img', {
								src: '/svg/product-holder.svg',
								alt: row.original.name || t('table.productThumbnail'),
								class: 'w-10 h-10 rounded-md object-cover flex-shrink-0',
							}),
					h('div', { class: 'flex-1 min-w-0' }, [
						h('div', { class: 'font-semibold text-sm text-neutral-900 dark:text-neutral-100' }, row.original.name),
						h('div', { class: 'text-xs text-neutral-400 dark:text-neutral-500 font-mono italic' }, row.original.code),
						variantBadge.length > 0 ? h('div', { class: 'mt-1 flex flex-wrap items-center gap-1' }, [...variantBadge]) : null,
					]),
				];

				return h('div', { class: 'flex items-start gap-3' }, children);
			},
		},
		{
			accessorKey: 'type',
			header: () => h('div', t('table.type')),
			cell: ({ row }) => {
				const productTypeStore = useProductTypeStore();
				const typeId = row.original.type;
				const typeLabel = productTypeStore.prod_types.find((pt) => pt.id === typeId)?.value ?? (typeId != null ? `Type ${typeId}` : '—');
				const metadata = row.original.metadata as { duration?: string } | undefined;
				const duration = metadata?.duration;
				const isMaintenance = typeId === 2 || (typeof typeLabel === 'string' && typeLabel.toLowerCase().includes('maintenance'));

				const typeColors = ['primary', 'success', 'warning', 'error', 'info', 'secondary'] as const;
				const badgeColor = typeId != null ? typeColors[typeId % typeColors.length] : 'neutral';

				const children: ReturnType<typeof h>[] = [h(UBadge, { class: 'capitalize', variant: 'subtle', color: badgeColor }, () => typeLabel)];
				if (isMaintenance && duration) {
					children.push(h(UBadge, { class: 'mt-1', variant: 'subtle', color: 'info', size: 'sm' }, () => `${t('table.duration')}: ${duration}`));
				}
				return h('div', { class: 'flex flex-col items-start gap-1' }, children);
			},
		},
		{
			accessorKey: 'price_types',
			header: () => h('div', t('table.price')),
			cell: ({ row }) => {
				const price_types: PriceInput[] | undefined = row.original.price_types;
				const pt = price_types?.[0];
				if (!pt) return h('span', { class: 'text-neutral-400 text-xs' }, '—');

				const hasSalePrice = pt.sale_price != null && pt.sale_price > 0;
				const sellingFormatted = pt.orig_sell_price != null ? formatCurrency(pt.orig_sell_price, pt.currency_code) : 'N/A';
				const saleFormatted = hasSalePrice ? formatCurrency(pt.sale_price!, pt.currency_code) : null;

				if (hasSalePrice && saleFormatted) {
					return h('div', { class: 'flex flex-col gap-0.5' }, [
						h('span', { class: 'text-sm font-semibold text-green-600 dark:text-green-400' }, saleFormatted),
						h('span', { class: 'text-xs text-neutral-400 line-through' }, sellingFormatted),
					]);
				}

				return h('div', { class: 'flex flex-col' }, [h('span', { class: 'text-sm font-semibold text-neutral-900 dark:text-neutral-100' }, sellingFormatted)]);
			},
		},
		{
			accessorKey: 'is_active',
			header: () => h('div', { class: 'text-center' }, t('table.active')),
			cell: ({ row }) => {
				const productStore = useProductStore();
				return h(
					'div',
					{
						class: 'flex justify-center',
						onClick: (e: Event) => e.stopPropagation(),
					},
					[
						h(USwitch, {
							'class': 'size-5',
							'modelValue': row.original.is_active,
							'disabled': false,
							'onUpdate:modelValue': (value: boolean) => productStore.updateStatus(row.original, value),
						}),
					],
				);
			},
		},
	];
}
