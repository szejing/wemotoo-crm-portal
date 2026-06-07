import { UBadge, USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { Voucher } from '~/utils/types/voucher';
import { useVoucherStore } from '~/stores/voucher/voucher';
import { getSortableHeader } from '../sortable';
import { headerCell, mutedCell, tableCellMeta } from '../styles';

type TranslateFn = (key: string) => string;

export function getVoucherColumns(t: TranslateFn): TableColumn<Voucher>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('p', { class: 'font-semibold text-highlighted' }, row.original.code),
					h('p', { class: 'text-sm text-muted' }, row.original.description),
				]);
			},
		},
		{
			accessorKey: 'discount_code',
			header: () => headerCell(t('table.linkedDiscount')),
			cell: ({ row }) => {
				const code = row.original.discount.code;
				if (!code) return mutedCell();
				return h(UBadge, { variant: 'subtle', color: 'info', size: 'md' }, () => code);
			},
		},
		{
			accessorKey: 'usage_count',
			header: () => headerCell(t('table.usage'), 'right'),
			cell: ({ row }) => {
				const limit = row.original.usage_limit;
				const count = row.original.usage_count || 0;
				if (limit) {
					return h('span', { class: 'text-sm text-default tabular-nums' }, `${count} / ${limit}`);
				}
				return h('span', { class: 'text-sm text-default tabular-nums' }, `${count} (∞)`);
			},
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'status',
			header: () => headerCell(t('table.active')),
			cell: ({ row }) => {
				const voucherStore = useNuxtApp().$pinia ? useVoucherStore() : null;
				const isActive = !row.original.is_disabled;
				return h(USwitch, {
					'class': 'size-5 mx-auto',
					'modelValue': isActive,
					'onUpdate:modelValue': (value: unknown) => {
						if (voucherStore) {
							voucherStore.updateStatus(row.original, value ? 'active' : 'inactive');
						}
					},
				});
			},
		},
	];
}
