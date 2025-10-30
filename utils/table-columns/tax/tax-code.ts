import type { TableColumn } from '@nuxt/ui';
import type { Tax } from '~/utils/types/tax';

const USwitch = resolveComponent('USwitch');

export const tax_code_columns: TableColumn<Tax>[] = [
	{
		accessorKey: 'code',
		header: 'Code',
		cell: ({ row }) => {
			return h('div', { class: 'flex-col-start' }, [
				h('h3', { class: 'text-neutral-800 font-bold' }, row.getValue('code')),
				h('h5', { class: 'text-neutral-400' }, row.getValue('description')),
			]);
		},
	},
	{
		accessorKey: 'type',
		header: 'Tax Type',
		cell: ({ row }) => {
			return h('div', { class: 'flex-col-start text-neutral-700' }, [
				h('h5', { class: 'text-neutral-900' }, row.getValue('is_inclusive') ? 'Inclusive' : 'Exclusive'),
			]);
		},
	},
	{
		accessorKey: 'is_active',
		header: 'Active',
		cell: ({ row }) => {
			return h(USwitch, {
				modelValue: row.getValue('active'),
				disabled: row.getValue('disabled'),
				onUpdate: (value: boolean) => {
					row.original.is_active = value;
				},
			});
		},
	},
];
