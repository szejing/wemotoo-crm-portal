import { USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { PaymentMethod } from '~/utils/types/payment-method';

type TranslateFn = (key: string) => string;

export function getPaymentMethodColumns(t: TranslateFn): TableColumn<PaymentMethod>[] {
	return [
		{
			accessorKey: 'code',
			header: () => h('div', { class: 'text-neutral-400' }, t('table.code')),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-semibold text-sm text-neutral-900 dark:text-neutral-100' }, row.original.short_desc),
					h('div', { class: 'text-xs text-neutral-400 dark:text-neutral-500 font-mono italic' }, row.original.code),
				]);
			},
		},
		{
			accessorKey: 'active',
			header: () => h('div', { class: 'text-neutral-400' }, t('table.active')),
			cell: ({ row }) => {
				const paymentMethodStore = usePaymentMethodStore();

				return h(USwitch, {
					'class': 'size-5',
					'modelValue': row.original.is_active,
					'disabled': false,
					'onUpdate:modelValue': (value: boolean) => paymentMethodStore.updateStatus(row.original, value),
				});
			},
		},
	];
}
