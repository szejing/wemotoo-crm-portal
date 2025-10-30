import type { ColumnDef } from '@tanstack/vue-table';

export const outlet_columns: ColumnDef<any>[] = [
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
		accessorKey: 'address',
		header: 'Address',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('address1')),
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('address2')),
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('address3')),
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('city')),
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('postal_code')),
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('state')),
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('country_code')),
			]);
		},
	},
];
