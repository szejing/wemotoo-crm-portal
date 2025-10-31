import type { ColumnDef } from '@tanstack/vue-table';
import type { Customer } from '~/utils/types/customer';

export const customer_columns: ColumnDef<Customer>[] = [
	{
		accessorKey: 'customer_no',
		header: 'No',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.index + 1)]);
		},
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			return h('div', [
				h('div', { class: 'font-bold text-neutral-900' }, row.original.customer_no),
				h('div', { class: 'text-neutral-600' }, row.original.name),
			]);
		},
	},
	{
		accessorKey: 'email_address',
		header: 'Email',
		cell: ({ row }) => {
			return h('div', [h('p', { class: 'font-medium text-neutral-900' }, row.original.email_address)]);
		},
	},
	{
		accessorKey: 'phone_number',
		header: 'Phone',
		cell: ({ row }) => {
			return h('div', [h('h5', { class: 'text-neutral-500' }, `(+${row.original.dial_code}) ${row.original.phone_no}`)]);
		},
	},
];
