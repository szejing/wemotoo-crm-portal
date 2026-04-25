/* eslint-disable indent */
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';
import { USwitch } from '#components';

type TranslateFn = (key: string) => string;

export function getShippingMethodColumns(t: TranslateFn): TableColumn<ShippingMethodOption>[] {
	return [
		{
			id: 'description',
			accessorKey: 'description',
			header: t('common.description'),
			cell: ({ row }) => {
				const description = row.original.description?.trim() ?? '';
				return h('span', { class: 'min-w-0' }, description);
			},
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
