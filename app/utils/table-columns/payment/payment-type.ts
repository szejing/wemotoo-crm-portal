import type { TableColumn } from '@nuxt/ui';
import type { PaymentType } from '~/utils/types/payment-type';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getPaymentTypeColumns(t: TranslateFn): TableColumn<PaymentType>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => h('div', { class: 'font-medium text-neutral-900 dark:text-neutral-100' }, row.original.code),
		},
		{
			accessorKey: 'desc',
			header: ({ column }) => getSortableHeader(column, t('table.description')),
			cell: ({ row }) => h('div', { class: 'text-neutral-600 dark:text-neutral-400' }, row.original.desc),
		},
		{
			accessorKey: 'short_desc',
			header: ({ column }) => getSortableHeader(column, t('table.shortDescription')),
			cell: ({ row }) => h('div', { class: 'text-neutral-600 dark:text-neutral-400' }, row.original.short_desc ?? '—'),
		},
	];
}
