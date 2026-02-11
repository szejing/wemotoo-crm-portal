import { SaleStatus } from 'wemotoo-common';
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { UBadge } from '#components';
import type { Bill } from '~/utils/types/bill';

type TranslateFn = (key: string) => string;

export function getSaleColumns(t: TranslateFn): TableColumn<Bill>[] {
	return [
		{
			accessorKey: 'bill_no',
			header: t('table.billNo'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('bill_no'))]);
			},
		},
		{
			accessorKey: 'status',
			header: t('table.status'),
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
			header: t('table.grossAmt'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('gross_amt'))]);
			},
		},
		{
			accessorKey: 'net_amt',
			header: t('table.netAmt'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('net_amt'))]);
			},
		},
		{
			accessorKey: 'disc_amt',
			header: t('table.discountAmt'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('disc_amt'))]);
			},
		},
		{
			accessorKey: 'void_amt',
			header: t('table.voidAmt'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('void_amt'))]);
			},
		},
		{
			accessorKey: 'total_item_qty',
			header: t('table.totalQty'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('total_item_qty'))]);
			},
		},
	];
}
