/* eslint-disable indent */
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { USwitch } from '#components';
import type { Courier } from '~/utils/types/courier';
import { headerCell } from './styles';

type TranslateFn = (key: string) => string;

export function getCourierColumns(t: TranslateFn): TableColumn<Courier>[] {
	return [
		{
			id: 'name',
			accessorKey: 'name',
			header: () => headerCell(t('common.name')),
			cell: ({ row }) => {
				const name = row.original.name?.trim() ?? '';
				return h('span', { class: 'min-w-0 font-medium' }, name);
			},
		},
		{
			id: 'description',
			accessorKey: 'description',
			header: () => headerCell(t('common.description')),
			cell: ({ row }) => {
				const description = row.original.description?.trim() ?? '';
				return h('span', { class: 'min-w-0 text-muted' }, description || t('common.notSet'));
			},
		},
		{
			accessorKey: 'is_active',
			header: () => headerCell(t('common.status')),
			cell: ({ row }) => {
				const courierStore = useCourierStore();
				return h(
					'div',
					{
						class: 'flex items-center gap-2 leading-none',
						onClick: (e: Event) => e.stopPropagation(),
					},
					[
						h(USwitch, {
							'class': 'size-4 cursor-pointer',
							'modelValue': row.original.is_active,
							'disabled': false,
							'onUpdate:modelValue': (value: unknown) => {
								void courierStore.updateStatus(row.original, value === true);
							},
						}),
					],
				);
			},
		},
	];
}
