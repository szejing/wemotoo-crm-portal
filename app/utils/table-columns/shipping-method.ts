/* eslint-disable indent */
import type { TableColumn } from '@nuxt/ui';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';
import { USwitch } from '#components';
import { formatCurrency } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export function getShippingMethodColumns(t: TranslateFn): TableColumn<ShippingMethodOption>[] {
	return [
		{
			accessorKey: 'name',
			header: t('common.name'),
		},
		{
			accessorKey: 'fee',
			header: t('components.shipment.shippingFee'),
			cell: ({ row }) => {
				const currencyCode = row.original.currency_code ?? 'MYR';
				return h('span', { class: 'text-neutral-900 dark:text-neutral-100' }, formatCurrency(row.original.fee ?? 0, currencyCode));
			},
		},
		{
			accessorKey: 'estimated_days',
			header: t('pages.estimatedDays'),
		},
		{
			accessorKey: 'priority',
			header: t('pages.shippingPriority'),
		},
		{
			accessorKey: 'is_active',
			header: t('common.status'),
			cell: ({ row }) => {
				const shippingStore = useShippingMethodStore();
				return h(
					'div',
					{
						class: 'flex items-center gap-2 leading-none',
						onClick: (e: Event) => e.stopPropagation(),
					},
					[
						h(USwitch, {
							'class': 'size-4 cursor-pointer',
							'modelValue': row.original.is_active,
							'disabled': false,
							'onUpdate:modelValue': (value: unknown) => {
								void shippingStore.updateStatus(row.original, value === true);
							},
						}),
					],
				);
			},
		},
	];
}
