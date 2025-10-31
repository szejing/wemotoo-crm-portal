import { h } from 'vue';
import { OrderItemStatus } from 'wemotoo-common';
import type { TableColumn } from '@nuxt/ui';
import type { SummSaleItem } from '~/utils/types/summ-sales';
import { UBadge } from '#components';

export const sale_summ_item_columns: TableColumn<SummSaleItem>[] = [
	{
		accessorKey: 'prod_code',
		header: 'Product',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('prod_code'))]);
		},
	},
	{
		accessorKey: 'item_status',
		header: 'Status',
		cell: ({ row }) => {
			const color = {
				[OrderItemStatus.ACTIVE]: 'success' as const,
				[OrderItemStatus.REFUNDED]: 'error' as const,
				[OrderItemStatus.VOIDED]: 'error' as const,
			}[row.getValue('item_status') as OrderItemStatus];

			const value = {
				[OrderItemStatus.ACTIVE]: 'ACTIVE',
				[OrderItemStatus.REFUNDED]: 'REFUNDED',
				[OrderItemStatus.VOIDED]: 'VOIDED',
			}[row.getValue('item_status') as OrderItemStatus];

			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => value);
		},
	},
	{
		accessorKey: 'total_qty',
		header: 'Qty',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_qty'))]);
		},
	},
	{
		accessorKey: 'gross_amt',
		header: 'Gross Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('gross_amt'))]);
		},
	},
	{
		accessorKey: 'net_amt',
		header: 'Net Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('net_amt'))]);
		},
	},
];
