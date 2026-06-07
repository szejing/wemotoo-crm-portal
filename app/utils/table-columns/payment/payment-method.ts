import { USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { PaymentMethod } from '~/utils/types/payment-method';
import { getSortableHeader } from '../sortable';
import { headerCell } from '../styles';

type TranslateFn = (key: string) => string;

export function getPaymentMethodColumns(t: TranslateFn): TableColumn<PaymentMethod>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('p', { class: 'font-semibold text-sm text-highlighted' }, row.original.short_desc),
					h('p', { class: 'text-xs text-muted font-mono italic' }, row.original.code),
				]);
			},
		},
		{
			accessorKey: 'active',
			header: () => headerCell(t('table.active')),
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
