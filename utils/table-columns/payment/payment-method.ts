import { USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { PaymentMethod } from '~/utils/types/payment-method';

export const payment_method_columns: TableColumn<PaymentMethod>[] = [
	{
		accessorKey: 'code',
		header: () => h('div', { class: 'text-neutral-400' }, 'Code'),
		cell: ({ row }) => {
			return h('div', [h('div', { class: 'font-bold text-neutral-900' }, row.original.code), h('div', { class: 'text-neutral-600' }, row.original.short_desc)]);
		},
	},
	{
		accessorKey: 'active',
		header: () => h('div', { class: 'text-neutral-400' }, 'Active'),
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
