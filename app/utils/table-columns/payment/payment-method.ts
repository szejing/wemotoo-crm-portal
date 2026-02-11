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
					h('div', { class: 'font-bold text-neutral-900' }, row.original.code),
					h('div', { class: 'text-neutral-600' }, row.original.short_desc),
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
