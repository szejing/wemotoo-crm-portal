import type { ColumnDef } from '@tanstack/vue-table';

export const customer_columns: ColumnDef<any>[] = [
	{
		accessorKey: 'customer_no',
		header: 'No',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('customer_no'))]);
		},
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('name'))]);
		},
	},
	{
		accessorKey: 'email_address',
		header: 'Email',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('email_address'))]);
		},
	},
	{
		accessorKey: 'phone_number',
		header: 'Phone',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [
				h('h5', { class: 'text-neutral-500' }, `(+${row.getValue('dial_code')}) ${row.getValue('phone_no')}`),
			]);
		},
	},
];
