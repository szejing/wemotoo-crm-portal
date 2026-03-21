import type { TableColumn, TableRow } from '@nuxt/ui';
import { formatCurrency, OrderItemStatus, OrderStatus } from 'wemotoo-common';
import { UBadge } from '#components';
import type { SummOrderItem } from '~/utils/types/summ-orders';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

type MoneyKey = keyof Pick<
	SummOrderItem,
	'gross_amt' | 'disc_amt' | 'net_amt' | 'gross_amt_exc' | 'disc_amt_exc' | 'net_amt_exc' | 'tax_amt_inc' | 'tax_amt_exc' | 'adj_amt'
>;

function sumMoneyFooter(column: { getFacetedRowModel: () => { rows: TableRow<SummOrderItem>[] } }, key: MoneyKey) {
	const rows = column.getFacetedRowModel().rows;
	const total = rows.reduce((acc, row) => {
		const v = row.original[key];
		return acc + (typeof v === 'number' && !Number.isNaN(v) ? v : 0);
	}, 0);
	const cc = rows[0]?.original.currency_code ?? 'MYR';
	return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, formatCurrency(total, cc))]);
}

function optionalMoneyCell(row: SummOrderItem, value: number | undefined) {
	if (value == null) return h('span', { class: 'text-neutral-400 dark:text-neutral-500 text-xs' }, '—');
	return h('div', { class: 'flex items-center gap-2' }, [h('p', formatCurrency(value, row.currency_code ?? 'MYR'))]);
}

export function getOrderSummItemColumns(t: TranslateFn): TableColumn<SummOrderItem>[] {
	return [
		{
			accessorKey: 'prod_name',
			header: ({ column }) => getSortableHeader(column, t('table.codeAndName')),
			cell: ({ row }) => {
				const o = row.original;
				const variantNameBadge =
					o.prod_variant_name != null && String(o.prod_variant_name).trim() !== ''
						? h(UBadge, { class: 'capitalize mt-1', variant: 'subtle', color: 'info' }, () => o.prod_variant_name!)
						: null;

				return h('div', { class: 'flex items-start gap-3' }, [
					h('img', {
						src: '/svg/product-holder.svg',
						alt: o.prod_name || t('table.productThumbnail'),
						class: 'w-10 h-10 rounded-md object-cover flex-shrink-0',
					}),
					h('div', { class: 'flex-1 min-w-0' }, [
						h('div', { class: 'flex items-center gap-1.5' }, [
							h('span', { class: 'font-semibold text-sm text-neutral-900 dark:text-neutral-100' }, o.prod_name || '—'),
						]),
						h('div', { class: 'text-xs text-neutral-400 dark:text-neutral-500 font-mono italic' }, o.prod_code ?? ''),
						variantNameBadge,
					]),
				]);
			},
		},
		{
			accessorKey: 'prod_variant_code',
			header: ({ column }) => getSortableHeader(column, t('table.prodVariantCode')),
			cell: ({ row }) => {
				const code = row.original.prod_variant_code;
				if (code == null || String(code).trim() === '') {
					return h('span', { class: 'text-neutral-400 dark:text-neutral-500 text-xs' }, '-');
				}
				return h('p', { class: 'font-mono text-sm text-neutral-800 dark:text-neutral-200' }, code);
			},
		},
		{
			accessorKey: 'currency_code',
			header: ({ column }) => getSortableHeader(column, t('table.currency')),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.original.currency_code)]);
			},
		},
		{
			accessorKey: 'status',
			header: ({ column }) => getSortableHeader(column, t('table.orderStatus')),
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
					[OrderStatus.COMPLETED]: t('options.completed'),
					[OrderStatus.CANCELLED]: t('options.cancelled'),
					[OrderStatus.REFUNDED]: t('options.refunded'),
					[OrderStatus.PENDING_PAYMENT]: t('options.pendingPayment'),
					[OrderStatus.PROCESSING]: t('options.processing'),
					[OrderStatus.REQUIRES_ACTION]: t('options.requiresAction'),
				}[row.original.status as OrderStatus];

				return h(UBadge, { variant: 'subtle', color }, () => value);
			},
		},
		{
			accessorKey: 'item_status',
			header: ({ column }) => getSortableHeader(column, t('table.itemStatus')),
			cell: ({ row }) => {
				const color = {
					[OrderItemStatus.ACTIVE]: 'success' as const,
					[OrderItemStatus.REFUNDED]: 'error' as const,
					[OrderItemStatus.VOIDED]: 'error' as const,
				}[row.original.item_status as OrderItemStatus];

				const value = {
					[OrderItemStatus.ACTIVE]: t('options.active'),
					[OrderItemStatus.REFUNDED]: t('options.refunded'),
					[OrderItemStatus.VOIDED]: t('options.voided'),
				}[row.original.item_status as OrderItemStatus];

				return h(UBadge, { variant: 'subtle', color }, () => value);
			},
		},
		{
			accessorKey: 'total_orders',
			header: ({ column }) => getSortableHeader(column, t('table.totalOrders')),
			footer: ({ column }) => {
				const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummOrderItem>) => acc + row.original.total_orders, 0);

				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, total)]);
			},
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', row.original.total_orders)]);
			},
		},
		{
			accessorKey: 'total_qty',
			header: ({ column }) => getSortableHeader(column, t('table.qty')),
			footer: ({ column }) => {
				const total = column.getFacetedRowModel().rows.reduce((acc: number, row: TableRow<SummOrderItem>) => acc + row.original.total_qty, 0);

				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, total)]);
			},
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', row.original.total_qty)]);
			},
		},
		{
			accessorKey: 'gross_amt',
			header: ({ column }) => getSortableHeader(column, t('table.grossAmt')),
			footer: ({ column }) => sumMoneyFooter(column, 'gross_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.gross_amt),
		},
		{
			accessorKey: 'disc_amt',
			header: ({ column }) => getSortableHeader(column, t('table.discountAmt')),
			footer: ({ column }) => sumMoneyFooter(column, 'disc_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.disc_amt),
		},
		{
			accessorKey: 'net_amt',
			header: ({ column }) => getSortableHeader(column, t('table.netAmt')),
			footer: ({ column }) => sumMoneyFooter(column, 'net_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.net_amt),
		},
		{
			accessorKey: 'gross_amt_exc',
			header: ({ column }) => getSortableHeader(column, t('table.grossAmtExc')),
			footer: ({ column }) => sumMoneyFooter(column, 'gross_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.gross_amt_exc),
		},
		{
			accessorKey: 'disc_amt_exc',
			header: ({ column }) => getSortableHeader(column, t('table.discAmtExc')),
			footer: ({ column }) => sumMoneyFooter(column, 'disc_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.disc_amt_exc),
		},
		{
			accessorKey: 'net_amt_exc',
			header: ({ column }) => getSortableHeader(column, t('table.netAmtExc')),
			footer: ({ column }) => sumMoneyFooter(column, 'net_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.net_amt_exc),
		},
		{
			accessorKey: 'tax_amt_inc',
			header: ({ column }) => getSortableHeader(column, t('table.taxAmtInc')),
			footer: ({ column }) => sumMoneyFooter(column, 'tax_amt_inc'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.tax_amt_inc),
		},
		{
			accessorKey: 'tax_amt_exc',
			header: ({ column }) => getSortableHeader(column, t('table.taxAmtExc')),
			footer: ({ column }) => sumMoneyFooter(column, 'tax_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.tax_amt_exc),
		},
		{
			accessorKey: 'adj_amt',
			header: ({ column }) => getSortableHeader(column, t('table.adjAmt')),
			footer: ({ column }) => sumMoneyFooter(column, 'adj_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original, row.original.adj_amt),
		},
	];
}
