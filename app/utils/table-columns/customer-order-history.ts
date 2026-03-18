import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { formatCurrency, PaymentStatus } from 'wemotoo-common';
import { UBadge, UIcon } from '#components';

import type { OrderHistory } from '~/utils/types/order-history';
import type { ItemModel } from '~/utils/models';
import { getPaymentStatusColor } from '~/utils/options/payment-status';

type TranslateFn = (key: string) => string;

export function getCustomerOrderHistoryColumns(
	t: TranslateFn,
	formatOrderItemsSummary: (items: ItemModel[] | undefined) => string,
): TableColumn<OrderHistory>[] {
	return [
		{
			id: 'order_no',
			accessorKey: 'order_no',
			header: t('table.orderId'),
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
			id: 'payment_status',
			accessorKey: 'payment_status',
			header: t('table.status'),
			cell: ({ row }) => {
				const status = row.original.payment_status;
				const color = getPaymentStatusColor(status) ?? 'neutral';
				const label = status === PaymentStatus.PAID ? t('options.paid') : status === PaymentStatus.PENDING ? t('options.pending') : (status ?? '—');
				return h(UBadge, { color, variant: 'subtle', size: 'sm', class: 'inline-flex items-center gap-1' }, () => [
					status === PaymentStatus.PAID ? h(UIcon, { name: 'i-heroicons-check-circle', class: 'w-3.5 h-3.5' }) : null,
					label,
				]);
			},
		},
		{
			id: 'net_total',
			accessorKey: 'net_total',
			header: t('table.totalAmt'),
			cell: ({ row }) => {
				const o = row.original;
				const code = o.currency?.code ?? 'MYR';
				return h('span', { class: 'font-medium text-default' }, formatCurrency(o.net_total ?? 0, code));
			},
		},
	];
}
