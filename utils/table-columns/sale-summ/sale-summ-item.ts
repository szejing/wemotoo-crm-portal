import { h, resolveComponent } from 'vue';
import { OrderItemStatus } from 'wemotoo-common';
import type { TableColumn } from '@nuxt/ui';
import type { SummSaleItem } from '~/utils/types/summ-sales';

const UBadge = resolveComponent('UBadge');

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
			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('item_status'));
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

export const sale_summ_item_header_columns: TableColumn<SummSaleItem>[] = [
	{
		accessorKey: 'biz_date',
		header: 'Biz Date',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('biz_date'))]);
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
		accessorKey: 'total_qty',
		header: 'Total Qty',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_qty'))]);
		},
	},
];
