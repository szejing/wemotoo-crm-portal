import type { TableColumn } from '@nuxt/ui';
import type { ProductVariation } from '~/utils/types/product-variation';
import { UBadge } from '#components';

type TranslateFn = (key: string) => string;

export function getProductOptionColumns(t: TranslateFn): TableColumn<ProductVariation>[] {
	return [
		{
			accessorKey: 'name',
			header: () => h('h1', t('table.name')),
			cell: ({ row }) => {
				return h('div', [h('div', { class: 'font-bold text-neutral-900' }, row.original.name)]);
			},
		},
		{
			accessorKey: 'values',
			header: () => h('h1', { class: 'flex justify-center w-full' }, [h('h1', t('table.values'))]),
			cell: ({ row }) => {
				if (row.original.options.length === 0) {
					return h('div', { class: 'flex justify-center' }, [h('p', { class: 'text-neutral-300' }, t('table.noValues'))]);
				}

				return h(
					'div',
					{ class: 'flex justify-center flex-wrap gap-1' },
					row.original.options.map((value) => h(UBadge, { variant: 'subtle', color: 'info' }, () => value.value)),
				);
			},
		},
	];
}
