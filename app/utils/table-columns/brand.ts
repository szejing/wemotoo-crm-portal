import type { TableColumn } from '@nuxt/ui';
import type { Brand } from '~/utils/types/brand';
import { UBadge } from '#components';

type TranslateFn = (key: string) => string;

export function getBrandColumns(t: TranslateFn): TableColumn<Brand>[] {
	return [
		{
			accessorKey: 'code',
			header: t('table.code'),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-semibold text-sm text-neutral-900 dark:text-neutral-100' }, row.original.description),
					h('div', { class: 'text-xs text-neutral-400 dark:text-neutral-500 font-mono italic' }, row.original.code),
				]);
			},
		},
		{
			accessorKey: 'total_products',
			header: () => h('div', { class: 'flex justify-end w-full' }, [h('h1', t('table.noOfItems'))]),
			meta: {
				class: {
					th: 'text-right',
					td: 'text-right',
				},
			},
			cell: ({ row }) => {
				const count = row.original.total_products ?? 0;
				return h(
					UBadge,
					{
						variant: 'subtle',
						color: count > 0 ? 'primary' : 'neutral',
						size: 'lg',
					},
					() => String(count),
				);
			},
		},
	];
}
