/* eslint-disable indent */
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';
import { UBadge, USwitch } from '#components';

type TranslateFn = (key: string) => string;

export function getShippingMethodColumns(t: TranslateFn): TableColumn<ShippingMethodOption>[] {
	return [
		{
			id: 'code_description',
			accessorKey: 'code',
			header: `${t('common.code')} / ${t('common.description')}`,
			cell: ({ row }) => {
				const code = row.original.code?.trim();
				const description = row.original.description?.trim();
				const children: ReturnType<typeof h>[] = [];
				if (code) {
					children.push(
						h(
							UBadge,
							{
								variant: 'subtle',
								color: 'neutral',
								size: 'sm',
								class: 'shrink-0 font-mono uppercase tracking-wide',
							},
							() => code,
						),
					);
				} else {
					children.push(h('span', { class: 'text-muted' }, '—'));
				}
				if (description) {
					children.push(h('span', {}, description));
				}
				return h('div', { class: 'flex flex-col gap-1 items-start min-w-0' }, children);
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
