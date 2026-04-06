import { UBadge, USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { DiscountResponse } from '~/repository/modules/discount/discount.type';
import { getSortableHeader } from '../sortable';
import { useDiscountStore } from '~/stores/discount/discount';

type TranslateFn = (key: string) => string;

export function getDiscountColumns(t: TranslateFn): TableColumn<DiscountResponse>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
					h('h5', { class: 'text-neutral-400' }, row.original.name),
				]);
			},
		},
		{
			accessorKey: 'rule',
			header: t('table.rule'),
			cell: ({ row }) => {
				const rule = row.original.rule;
				if (!rule) return '-';
				return h('div', { class: 'flex flex-col' }, [
					h('span', { class: 'text-sm font-medium' }, rule.type),
					h('span', { class: 'text-xs text-neutral-500' }, rule.value.toString()),
				]);
			},
		},
		{
			accessorKey: 'usage_count',
			header: t('table.usage'),
			cell: ({ row }) => {
				const limit = row.original.usage_limit;
				const count = row.original.usage_count || 0;
				if (limit) {
					return h('span', {}, `${count} / ${limit}`);
				}
				return h('span', {}, `${count}  (∞)`);
			},
		},
		{
			accessorKey: 'status',
			header: () => h('div', { class: 'text-center' }, t('table.active')),
			cell: ({ row }) => {
				const discountStore = useNuxtApp().$pinia ? useDiscountStore() : null;
				const isActive = row.original.status === 'active';
				return h(USwitch, {
					'class': 'size-5 mx-auto',
					'modelValue': isActive,
					'onUpdate:modelValue': (value: unknown) => {
						if (discountStore) {
							discountStore.updateStatus(row.original, value ? 'active' : 'inactive');
						}
					},
				});
			},
		},
	];
}
