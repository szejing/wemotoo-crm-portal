import type { TableColumn } from '@nuxt/ui';
import type { Brand } from '~/utils/types/brand';
import { UBadge } from '#components';

export type TableColumnsTranslate = (key: string) => string;

export function getBrandColumns(t: TableColumnsTranslate): TableColumn<Brand>[] {
	return [
		{
			accessorKey: 'code',
			header: t('table.code'),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-bold text-neutral-900' }, row.original.code),
					h('div', { class: 'text-neutral-600' }, row.original.description),
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
