import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { formatCurrency, OrderStatus } from 'wemotoo-common';
import { UBadge, UIcon } from '#components';
import type { OrderHistory } from '~/utils/types/order-history';
import type { ItemModel } from '~/utils/models';
import { getSortableHeader } from './sortable';
import { getOrderStatusColor } from '../options';

type TranslateFn = (key: string) => string;

export function getCustomerOrderHistoryColumns(
	t: TranslateFn,
	formatOrderItemsSummary: (items: ItemModel[] | undefined) => string,
): TableColumn<OrderHistory>[] {
	return [
		{
			id: 'order_no',
			accessorKey: 'order_no',
			accessorFn: (row) => (row.order_date_time ? new Date(row.order_date_time).getTime() : 0),
			header: ({ column }) => getSortableHeader(column, t('table.orderNo')),
			cell: ({ row }) => {
				const d = row.original.order_date_time;
				let dateLabel = '—';
				if (d) {
					try {
						const date = typeof d === 'string' ? new Date(d) : d;
						dateLabel = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
					} catch {
						dateLabel = String(d);
					}
				}

				return h('div', { class: 'flex flex-col gap-0.5' }, [
					h('span', { class: 'font-medium text-default' }, `#${row.original.order_no}`),
					h('span', { class: 'text-sm text-muted' }, dateLabel),
				]);
			},
		},
		{
			id: 'items',
			header: t('table.items'),
			cell: ({ row }) => h('span', { class: 'text-default' }, formatOrderItemsSummary(row.original.items)),
		},
		{
			id: 'order_status',
			accessorKey: 'order_status',
			header: ({ column }) => getSortableHeader(column, t('table.orderStatus')),
			cell: ({ row }) => {
				const status = row.original.status;
				const color = getOrderStatusColor(status) ?? 'neutral';
				const label =
					status === OrderStatus.COMPLETED ? t('options.completed') : status === OrderStatus.PENDING_PAYMENT ? t('options.pendingPayment') : (status ?? '—');
				return h(UBadge, { color, variant: 'subtle', class: 'inline-flex items-center gap-1' }, () => [
					status === OrderStatus.COMPLETED ? h(UIcon, { name: 'i-heroicons-check-circle', class: 'w-3.5 h-3.5' }) : null,
					label,
				]);
			},
		},
		{
			id: 'net_total',
			accessorKey: 'net_total',
			accessorFn: (row) => row.net_total ?? 0,
			header: ({ column }) => getSortableHeader(column, t('table.totalAmt')),
			cell: ({ row }) => {
				const o = row.original;
				const code = o.currency?.code ?? 'MYR';
				return h('span', { class: 'font-medium text-default' }, formatCurrency(o.net_total ?? 0, code));
			},
		},
	];
}
