import type { TableColumn } from '@nuxt/ui';
import type { SummSalePayment } from '~/utils/types/summ-sales';

export const sale_summ_payment_columns: TableColumn<SummSalePayment>[] = [
	{
		accessorKey: 'currency_code',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Currency'),
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('currency_code'))]);
		},
	},
	{
		accessorKey: 'payment_type_desc',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Desc'),
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('payment_type_desc'))]);
		},
	},
	{
		accessorKey: 'total_txns',
		header: () => h('h1', { class: 'text-neutral-400' }, 'Total Txns'),
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_txns'))]);
		},
	},
];
