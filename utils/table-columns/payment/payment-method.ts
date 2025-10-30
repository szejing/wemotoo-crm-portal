import type { TableColumn } from '@nuxt/ui';
import type { PaymentMethod } from '~/utils/types/payment-method';

const USwitch = resolveComponent('USwitch');

export const payment_method_columns: TableColumn<PaymentMethod>[] = [
	{
		accessorKey: 'code',
		header: 'Code',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('code'))]);
		},
	},
	{
		accessorKey: 'detail',
		header: 'Detail',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('detail'))]);
		},
	},
	{
		accessorKey: 'active',
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
