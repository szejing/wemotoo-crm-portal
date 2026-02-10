import type { TableColumn } from '@nuxt/ui';
import type { Tag } from '~/utils/types/tag';
import type { TableColumnsTranslate } from './brand';
import { UBadge } from '#components';

export function getTagColumns(t: TableColumnsTranslate): TableColumn<Tag>[] {
	return [
		{
			accessorKey: 'value',
			header: () => h('h1', t('table.description')),
			cell: ({ row }) => {
				return h('div', [h('div', { class: 'font-bold text-neutral-900' }, row.original.value)]);
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
