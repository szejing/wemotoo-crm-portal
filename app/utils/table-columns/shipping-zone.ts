/* eslint-disable indent */
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { ShippingZoneRecord } from '~/utils/types/order-fulfillment-shipping';
import { USwitch } from '#components';

type TranslateFn = (key: string) => string;

export function getShippingZoneColumns(t: TranslateFn): TableColumn<ShippingZoneRecord>[] {
	return [
		{
			accessorKey: 'name',
			/** Call `t` when the header renders so lazy-loaded locale messages are available. */
			header: () => t('table.shippingZoneName'),
		},
		{
			id: 'region',
			header: () => t('table.shippingZoneRegion'),
			cell: ({ row }) => {
				const z = row.original;
				const state = z.state?.trim();
				const parts = [z.country_code, state].filter(Boolean);
				return h('span', { class: 'text-neutral-900 dark:text-neutral-100' }, parts.join(' · ') || z.country_code);
			},
		},
		{
			id: 'methods_count',
			header: () => t('table.shippingZoneMethods'),
			cell: ({ row }) => String(row.original.shipping_method_ids?.length ?? 0),
		},
		{
			accessorKey: 'fee_override',
			header: () => t('table.shippingZoneFeeOverride'),
			cell: ({ row }) => {
				const v = row.original.fee_override;
				if (v == null || Number.isNaN(v)) {
					return h('span', { class: 'text-muted' }, '—');
				}
				return h('span', { class: 'text-neutral-900 dark:text-neutral-100' }, String(v));
			},
		},
		{
			accessorKey: 'estimated_days_override',
			header: () => t('table.shippingZoneDaysOverride'),
			cell: ({ row }) => {
				const v = row.original.estimated_days_override;
				if (v == null || Number.isNaN(v)) {
					return h('span', { class: 'text-muted' }, '—');
				}
				return h('span', { class: 'text-neutral-900 dark:text-neutral-100' }, String(v));
			},
		},
		{
			accessorKey: 'is_active',
			header: () => t('common.status'),
			cell: ({ row }) => {
				const zoneStore = useShippingZoneStore();
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
								void zoneStore.updateZoneStatus(row.original, value === true);
							},
						}),
					],
				);
			},
		},
	];
}
