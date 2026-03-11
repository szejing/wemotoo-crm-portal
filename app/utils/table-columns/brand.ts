import type { TableColumn } from '@nuxt/ui';
import type { Brand } from '~/utils/types/brand';
import { UBadge } from '#components';
import { getSortableHeader } from './sortable';

type TranslateFn = (key: string) => string;

export function getBrandColumns(t: TranslateFn): TableColumn<Brand>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				const nameClass = 'font-semibold text-sm text-neutral-900 dark:text-neutral-100';
				const descClass = 'text-xs text-neutral-400 dark:text-neutral-500 font-mono italic';

				const statusDot = h('span', {
					class: ['inline-block size-2 rounded-full flex-shrink-0', row.original.is_active !== false ? 'bg-success-500' : 'bg-neutral-300 dark:bg-neutral-600'],
					title: row.original.is_active !== false ? t('common.active') : t('common.inactive'),
				});

				return h('div', { class: 'flex-1 min-w-0' }, [
					h('div', { class: 'flex items-center gap-1.5' }, [statusDot, h('span', { class: nameClass }, row.original.description)]),
					h('p', { class: `truncate ${descClass}` }, row.original.code),
				]);
			},
		},
		{
			accessorKey: 'total_products',
			header: ({ column }) => getSortableHeader(column, t('table.noOfItems')),
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
