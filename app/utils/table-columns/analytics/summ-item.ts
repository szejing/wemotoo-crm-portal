import { h } from 'vue';
import type { TableColumn, TableRow } from '@nuxt/ui';
import { OrderItemStatus } from 'yeppi-common';
import { UBadge } from '#components';
import { headerCell, moneyCell, mutedCell, numberCell, optionalMoneyCell, tableCellMeta } from '../styles';
import type { SummCountKey, SummItemRow, TranslateFn } from './types';

const SUMM_ITEM_COUNT_LABELS: Record<SummCountKey, string> = {
	total_orders: 'table.totalOrders',
	total_txns: 'table.totalTxns',
};

const SUMM_ITEM_BASE_COLUMN_LABELS = {
	prod_name: 'table.codeAndName',
	prod_variant_code: 'table.prodVariantCode',
	item_status: 'table.itemStatus',
	total_qty: 'table.qty',
	gross_amt: 'table.grossAmt',
	disc_amt: 'table.discountAmt',
	net_amt: 'table.netAmt',
	gross_amt_exc: 'table.grossAmtExc',
	disc_amt_exc: 'table.discAmtExc',
	net_amt_exc: 'table.netAmtExc',
	tax_amt_inc: 'table.taxAmtInc',
	tax_amt_exc: 'table.taxAmtExc',
	adj_amt: 'table.adjAmt',
} as const;

export function getSummItemColumnLabels(countKey: SummCountKey) {
	return {
		prod_name: SUMM_ITEM_BASE_COLUMN_LABELS.prod_name,
		prod_variant_code: SUMM_ITEM_BASE_COLUMN_LABELS.prod_variant_code,
		item_status: SUMM_ITEM_BASE_COLUMN_LABELS.item_status,
		[countKey]: SUMM_ITEM_COUNT_LABELS[countKey],
		total_qty: SUMM_ITEM_BASE_COLUMN_LABELS.total_qty,
		gross_amt: SUMM_ITEM_BASE_COLUMN_LABELS.gross_amt,
		disc_amt: SUMM_ITEM_BASE_COLUMN_LABELS.disc_amt,
		net_amt: SUMM_ITEM_BASE_COLUMN_LABELS.net_amt,
		gross_amt_exc: SUMM_ITEM_BASE_COLUMN_LABELS.gross_amt_exc,
		disc_amt_exc: SUMM_ITEM_BASE_COLUMN_LABELS.disc_amt_exc,
		net_amt_exc: SUMM_ITEM_BASE_COLUMN_LABELS.net_amt_exc,
		tax_amt_inc: SUMM_ITEM_BASE_COLUMN_LABELS.tax_amt_inc,
		tax_amt_exc: SUMM_ITEM_BASE_COLUMN_LABELS.tax_amt_exc,
		adj_amt: SUMM_ITEM_BASE_COLUMN_LABELS.adj_amt,
	} as const;
}

type MoneyKey = keyof Pick<
	SummItemRow,
	'gross_amt' | 'disc_amt' | 'net_amt' | 'gross_amt_exc' | 'disc_amt_exc' | 'net_amt_exc' | 'tax_amt_inc' | 'tax_amt_exc' | 'adj_amt'
>;

const sumMoneyFooter = (column: { getFacetedRowModel: () => { rows: TableRow<SummItemRow>[] } }, key: MoneyKey) => {
	const rows = column.getFacetedRowModel().rows;
	const total = rows.reduce((acc, row) => {
		const v = row.original[key];
		return acc + (typeof v === 'number' && !Number.isNaN(v) ? v : 0);
	}, 0);
	const cc = rows[0]?.original.currency_code ?? 'MYR';
	return moneyCell(total, cc);
};

const countFooter = (column: { getFacetedRowModel: () => { rows: TableRow<SummItemRow>[] } }, key: SummCountKey) => {
	const total = column.getFacetedRowModel().rows.reduce((acc, row) => acc + (row.original[key] ?? 0), 0);

	return numberCell(total);
};

const qtyFooter = (column: { getFacetedRowModel: () => { rows: TableRow<SummItemRow>[] } }) => {
	const total = column.getFacetedRowModel().rows.reduce((acc, row) => acc + row.original.total_qty, 0);

	return numberCell(total);
};

export function getSummItemColumns<T extends SummItemRow>(t: TranslateFn, countKey: SummCountKey): TableColumn<T>[] {
	const columns: TableColumn<SummItemRow>[] = [
		{
			accessorKey: 'prod_name',
			header: () => headerCell(t('table.codeAndName')),
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
						h('div', { class: 'flex items-center gap-1.5' }, [h('span', { class: 'font-semibold text-sm text-highlighted' }, o.prod_name || '—')]),
						h('div', { class: 'text-xs text-muted font-mono italic' }, o.prod_code ?? ''),
						variantNameBadge,
					]),
				]);
			},
		},
		{
			accessorKey: 'prod_variant_code',
			header: () => headerCell(t('table.prodVariantCode')),
			cell: ({ row }) => {
				const code = row.original.prod_variant_code;
				if (code == null || String(code).trim() === '') {
					return mutedCell();
				}
				return h('p', { class: 'font-mono text-sm text-default' }, code);
			},
		},
		{
			accessorKey: 'item_status',
			header: () => headerCell(t('table.itemStatus')),
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
			accessorKey: countKey,
			header: () => headerCell(t(SUMM_ITEM_COUNT_LABELS[countKey]), 'right'),
			footer: ({ column }) => countFooter(column, countKey),
			cell: ({ row }) => numberCell(row.original[countKey] ?? 0),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'total_qty',
			header: () => headerCell(t('table.qty'), 'right'),
			footer: ({ column }) => qtyFooter(column),
			cell: ({ row }) => numberCell(row.original.total_qty),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'gross_amt',
			header: () => headerCell(t('table.grossAmt'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'gross_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original.gross_amt, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'disc_amt',
			header: () => headerCell(t('table.discountAmt'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'disc_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original.disc_amt, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'net_amt',
			header: () => headerCell(t('table.netAmt'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'net_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original.net_amt, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'gross_amt_exc',
			header: () => headerCell(t('table.grossAmtExc'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'gross_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original.gross_amt_exc, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'disc_amt_exc',
			header: () => headerCell(t('table.discAmtExc'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'disc_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original.disc_amt_exc, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'net_amt_exc',
			header: () => headerCell(t('table.netAmtExc'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'net_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original.net_amt_exc, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'tax_amt_inc',
			header: () => headerCell(t('table.taxAmtInc'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'tax_amt_inc'),
			cell: ({ row }) => optionalMoneyCell(row.original.tax_amt_inc, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'tax_amt_exc',
			header: () => headerCell(t('table.taxAmtExc'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'tax_amt_exc'),
			cell: ({ row }) => optionalMoneyCell(row.original.tax_amt_exc, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'adj_amt',
			header: () => headerCell(t('table.adjAmt'), 'right'),
			footer: ({ column }) => sumMoneyFooter(column, 'adj_amt'),
			cell: ({ row }) => optionalMoneyCell(row.original.adj_amt, row.original.currency_code ?? 'MYR'),
			...tableCellMeta.rightNumeric,
		},
	];

	return columns as TableColumn<T>[];
}
