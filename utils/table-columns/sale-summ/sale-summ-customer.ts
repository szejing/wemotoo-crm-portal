import type { TableColumn } from '@nuxt/ui';
import { h, resolveComponent } from 'vue';
import { SaleStatus } from 'wemotoo-common';
import type { SummSaleCustomer } from '~/utils/types/summ-sales';

const UBadge = resolveComponent('UBadge');

export const sale_summ_customer_columns: TableColumn<SummSaleCustomer>[] = [
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
		header: 'Status',
		cell: ({ row }) => {
			const color = {
				[SaleStatus.COMPLETED]: 'success' as const,
				[SaleStatus.CANCELLED]: 'neutral' as const,
				[SaleStatus.REFUNDED]: 'error' as const,
			}[row.getValue('status') as SaleStatus];
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
	{
		accessorKey: 'total_txns',
		header: 'Total Txns',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_txns'))]);
		},
	},
	{
		accessorKey: 'total_qty',
		header: 'Total Qty',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_qty'))]);
		},
	},
];
