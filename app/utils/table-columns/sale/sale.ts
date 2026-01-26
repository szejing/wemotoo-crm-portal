import { SaleStatus } from 'wemotoo-common';
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { UBadge } from '#components';
import type { Bill } from '~/utils/types/bill';

export const sale_columns: TableColumn<Bill>[] = [
	{
		accessorKey: 'bill_no',
		header: 'Bill No',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('bill_no'))]);
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
	// {
	// 	accessorKey: 'currency_code',
	// 	header: 'Currency',
	// },
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
		accessorKey: 'disc_amt',
		header: 'Discount Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('disc_amt'))]);
		},
	},
	{
		accessorKey: 'void_amt',
		header: 'Void Amt',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('void_amt'))]);
		},
	},
	{
		accessorKey: 'total_item_qty',
		header: 'Total Qty',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_item_qty'))]);
		},
	},
];
