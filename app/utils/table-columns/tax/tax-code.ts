import { USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { Tax } from '~/utils/types/tax';

export const tax_code_columns: TableColumn<Tax>[] = [
	{
		accessorKey: 'code',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Code'),
		cell: ({ row }) => {
			return h('div', { class: 'flex flex-col gap-1' }, [
				h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
				h('h5', { class: 'text-neutral-400' }, row.original.description),
			]);
		},
	},
	{
		accessorKey: 'type',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Tax Type'),
		cell: ({ row }) => {
			return h('div', { class: 'flex flex-col gap-1 text-neutral-900' }, [h('h5', row.original.is_inclusive ? 'Inclusive' : 'Exclusive')]);
		},
	},
	{
		accessorKey: 'is_active',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Active'),
		cell: ({ row }) => {
			return h(USwitch, {
				'class': 'size-5',
				'modelValue': row.original.is_active,
				'disabled': false,
				'onUpdate:modelValue': (value: boolean) => {
					row.original.is_active = value;
				},
			});
		},
	},
];
