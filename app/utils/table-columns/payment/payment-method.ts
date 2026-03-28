import { USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { PaymentMethod } from '~/utils/types/payment-method';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getPaymentMethodColumns(t: TranslateFn): TableColumn<PaymentMethod>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-semibold text-sm text-neutral-900 dark:text-neutral-100' }, row.original.short_desc),
					h('div', { class: 'text-xs text-neutral-400 dark:text-neutral-500 font-mono italic' }, row.original.code),
				]);
			},
		},
		{
			accessorKey: 'active',
			header: () => h('div', { class: 'text-center' }, t('table.active')),
			cell: ({ row }) => {
				const paymentMethodStore = usePaymentMethodStore();
				return h(
					'div',
					{
						class: 'flex justify-center',
						onClick: (e: Event) => e.stopPropagation(),
					},
					[
						h(USwitch, {
							'class': 'size-5',
							'modelValue': row.original.is_active,
							'disabled': false,
							'onUpdate:modelValue': (value: unknown) => paymentMethodStore.updateStatus(row.original, value as boolean),
						}),
					],
				);
			},
		},
	];
}
