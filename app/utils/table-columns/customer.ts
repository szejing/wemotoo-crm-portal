import type { ColumnDef } from '@tanstack/vue-table';
import type { Customer } from '~/utils/types/customer';
import type { TableColumnsTranslate } from './brand';

export function getCustomerColumns(t: TableColumnsTranslate): ColumnDef<Customer>[] {
	return [
		{
			accessorKey: 'customer_no',
			header: t('table.noLabel'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.index + 1)]);
			},
		},
		{
			accessorKey: 'name',
			header: t('table.name'),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-bold text-neutral-900' }, row.original.customer_no),
					h('div', { class: 'text-neutral-600' }, row.original.name),
				]);
			},
		},
		{
			accessorKey: 'email_address',
			header: t('table.email'),
			cell: ({ row }) => {
				return h('div', [h('p', { class: 'font-medium text-neutral-900' }, row.original.email_address)]);
			},
		},
		{
			accessorKey: 'phone_number',
			header: t('table.phone'),
			cell: ({ row }) => {
				return h('div', [h('h5', { class: 'text-neutral-500' }, `(+${row.original.dial_code}) ${row.original.phone_no}`)]);
			},
		},
	];
}
