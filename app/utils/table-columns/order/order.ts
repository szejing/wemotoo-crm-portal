import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { formatCurrency, OrderStatus, OrderType } from 'wemotoo-common';
import { UBadge, UIcon, UTooltip } from '#components';
import type { OrderHistory } from '~/utils/types/order-history';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getOrderColumns(t: TranslateFn): TableColumn<OrderHistory>[] {
	return [
		{
			id: 'index',
			accessorFn: (_row, index) => index,
			header: ({ column }) => getSortableHeader(column, t('table.no')),
			cell: ({ row }) => {
				return h('div', [h('p', row.index + 1)]);
			},
		},
		{
			id: 'order_no',
			accessorFn: (row) => (row.order_date_time ? new Date(row.order_date_time).getTime() : 0),
			header: ({ column }) => getSortableHeader(column, t('table.orderNo')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('p', { class: 'font-medium text-neutral-800 dark:text-neutral-100' }, row.original.order_no),
					h('p', { class: 'text-sm text-neutral-400 dark:text-neutral-500' }, row.original.order_date_time),
				]);
			},
		},
		{
			id: 'order_type',
			accessorFn: (row) => ((row.order_type ?? OrderType.PICKUP) === OrderType.DELIVERY ? 1 : 0),
			header: ({ column }) => getSortableHeader(column, t('table.orderType')),
			cell: ({ row }) => {
				const orderType = row.original.order_type ?? OrderType.PICKUP;
				const isDelivery = orderType === OrderType.DELIVERY;
				const orderTypeLabel = isDelivery ? t('components.orderDetail.orderTypeDelivery') : t('components.orderDetail.orderTypePickup');
				const description = row.original.shipping_method?.description?.trim();
				const tooltipText = description && description.length > 0 ? description : orderTypeLabel;
				const iconName = isDelivery ? 'i-heroicons-truck' : 'i-heroicons-building-storefront';

				return h('div', { class: 'flex justify-center' }, [
					h(
						UTooltip,
						{ text: tooltipText, popper: { placement: 'top' } },
						() =>
							h(UIcon, {
								name: iconName,
								class: 'size-5 shrink-0 text-main',
							}),
					),
				]);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			id: 'customer',
			accessorFn: (row) => row.customer?.name ?? '',
			header: ({ column }) => getSortableHeader(column, t('table.customer')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, `${row.original.customer?.customer_no} | ${row.original.customer?.name}`),
					h('h5', { class: 'text-neutral-400' }, row.original.customer?.email_address),
				]);
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
				}[row.original.status as string];

				const value = {
					[OrderStatus.COMPLETED]: t('options.completed'),
					[OrderStatus.CANCELLED]: t('options.cancelled'),
					[OrderStatus.REFUNDED]: t('options.refunded'),
					[OrderStatus.PENDING_PAYMENT]: t('options.pendingPayment'),
					[OrderStatus.PROCESSING]: t('options.processing'),
					[OrderStatus.REQUIRES_ACTION]: t('options.requiresAction'),
				}[row.original.status as string];

				return h(UBadge, { class: 'capitalize ', size: 'lg', variant: 'subtle', color }, () => value);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			accessorKey: 'gross_amt',
			header: ({ column }) => getSortableHeader(column, t('table.grossAmt')),
			cell: ({ row }) => {
				return h('div', [h('p', formatCurrency(row.original.gross_amt ?? 0, row.original.currency.code))]);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			accessorKey: 'tax_amt_exc',
			header: ({ column }) => getSortableHeader(column, t('table.taxAmtExc')),
			cell: ({ row }) => {
				return h('div', [h('p', formatCurrency(row.original.tax_amt_exc ?? 0, row.original.currency.code))]);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			accessorKey: 'net_amt',
			header: ({ column }) => getSortableHeader(column, t('table.netAmt')),
			cell: ({ row }) => {
				return h('div', [h('p', formatCurrency(row.original.net_amt ?? 0, row.original.currency.code))]);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
	];
}
