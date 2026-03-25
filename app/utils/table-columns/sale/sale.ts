import { OrderStatus } from 'wemotoo-common';
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { UBadge } from '#components';
import type { Bill } from '~/utils/types/bill';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getSaleColumns(t: TranslateFn): TableColumn<Bill>[] {
	return [
		{
			accessorKey: 'order_no',
			header: ({ column }) => getSortableHeader(column, t('table.orderNo')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('order_no'))]);
			},
		},
		{
			accessorKey: 'status',
			header: ({ column }) => getSortableHeader(column, t('table.status')),
			cell: ({ row }) => {
				const color = {
					[OrderStatus.COMPLETED]: 'success' as const,
					[OrderStatus.CANCELLED]: 'error' as const,
					[OrderStatus.REFUNDED]: 'error' as const,
					[OrderStatus.PENDING_PAYMENT]: 'info' as const,
					[OrderStatus.PROCESSING]: 'info' as const,
					[OrderStatus.REQUIRES_ACTION]: 'warning' as const,
				}[row.getValue('status') as OrderStatus];
				return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'));
			},
		},
		{
			accessorKey: 'gross_amt',
			header: ({ column }) => getSortableHeader(column, t('table.grossAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('gross_amt'))]);
			},
		},
		{
			accessorKey: 'net_amt',
			header: ({ column }) => getSortableHeader(column, t('table.netAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('net_amt'))]);
			},
		},
		{
			accessorKey: 'disc_amt',
			header: ({ column }) => getSortableHeader(column, t('table.discountAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('disc_amt'))]);
			},
		},
		{
			accessorKey: 'void_amt',
			header: ({ column }) => getSortableHeader(column, t('table.voidAmt')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('void_amt'))]);
			},
		},
		{
			accessorKey: 'total_item_qty',
			header: ({ column }) => getSortableHeader(column, t('table.totalQty')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_item_qty'))]);
			},
		},
	];
}
