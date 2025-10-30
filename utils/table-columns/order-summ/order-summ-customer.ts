import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { SummOrderCustomer } from '~/utils/types/summ-orders';
import { OrderStatus } from 'wemotoo-common';

const UBadge = resolveComponent('UBadge');

export const order_summ_customer_columns: TableColumn<SummOrderCustomer>[] = [
	{
		accessorKey: 'customer',
		header: 'Customer',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [
				h('p', { class: 'font-medium text-neutral-900' }, row.getValue('customer_name')),
				h('span', { class: 'text-neutral-500' }, `#${row.getValue('customer_no')}`),
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
			}[row.getValue('status') as OrderStatus];

			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'));
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
