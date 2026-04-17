import { UBadge, USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { Voucher } from '~/utils/types/voucher';
import { useVoucherStore } from '~/stores/Voucher/Voucher';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getVoucherColumns(t: TranslateFn): TableColumn<Voucher>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
					h('h5', { class: 'text-neutral-400' }, row.original.description),
				]);
			},
		},
		{
			accessorKey: 'discount_code',
			header: t('table.linkedDiscount'),
			cell: ({ row }) => {
				const code = row.original.discount.code;
				if (!code) return '—';
				return h(UBadge, { variant: 'subtle', color: 'info', size: 'md' }, () => code);
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
				return h('span', {}, `${count} (∞)`);
			},
		},
		{
			accessorKey: 'status',
			header: () => h('div', { class: 'text-center' }, t('table.active')),
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
