import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { SummOrderCustomer } from '~/utils/types/summ-orders';
import { OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';

export const order_summ_customer_columns: TableColumn<SummOrderCustomer>[] = [
	{
		accessorKey: 'customer',
		header: 'Customer',
		cell: ({ row }) => {
			return h('div', [
				h('div', { class: 'font-bold text-neutral-900' }, row.original.customer_no),
				h('div', { class: 'text-neutral-600' }, row.original.customer_name),
			]);
		},
	},
	{
		accessorKey: 'status',
		header: 'Order Status',
		cell: ({ row }) => {
			const color = {
				[OrderStatus.COMPLETED]: 'success' as const,
				[OrderStatus.CANCELLED]: 'neutral' as const,
				[OrderStatus.REFUNDED]: 'error' as const,
				[OrderStatus.PENDING_PAYMENT]: 'info' as const,
				[OrderStatus.PROCESSING]: 'info' as const,
				[OrderStatus.REQUIRES_ACTION]: 'warning' as const,
			}[row.original.status as OrderStatus];

			const value = {
				[OrderStatus.COMPLETED]: 'COMPLETED',
				[OrderStatus.CANCELLED]: 'CANCELLED',
				[OrderStatus.REFUNDED]: 'REFUNDED',
				[OrderStatus.PENDING_PAYMENT]: 'PENDING PAYMENT',
				[OrderStatus.PROCESSING]: 'PROCESSING',
				[OrderStatus.REQUIRES_ACTION]: 'REQUIRES ACTION',
			}[row.original.status as OrderStatus];

			return h(UBadge, { variant: 'subtle', color }, () => value);
		},
	},
	{
		accessorKey: 'gross_amt',
		header: 'Gross Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(row.original.gross_amt, row.original.currency_code)),
			]);
		},
	},
	{
		accessorKey: 'net_amt',
		header: 'Net Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(row.original.net_amt, row.original.currency_code)),
			]);
		},
	},
];
