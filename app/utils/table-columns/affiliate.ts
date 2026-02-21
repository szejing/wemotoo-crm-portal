import type { ColumnDef } from '@tanstack/vue-table';
import type { Affiliate } from '~/utils/types/affiliate';

type TranslateFn = (key: string) => string;

export function getAffiliateColumns(t: TranslateFn): ColumnDef<Affiliate>[] {
	return [
		{
			accessorKey: 'row_index',
			header: t('table.noLabel'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [
					h('p', { class: 'font-medium text-neutral-900 dark:text-neutral-100' }, String(row.index + 1)),
				]);
			},
		},
		{
			accessorKey: 'slug',
			header: t('affiliate.slug'),
			cell: ({ row }) => {
				const a = row.original;
				return h('div', [
					h('div', { class: 'font-semibold text-neutral-900 dark:text-neutral-100' }, a.slug || '—'),
					h('div', { class: 'text-sm text-neutral-600 dark:text-neutral-400' }, a.user_id),
				]);
			},
		},
		{
			accessorKey: 'tier',
			header: t('affiliate.tier'),
			cell: ({ row }) => {
				const tier = row.original.tier;
				return h('p', { class: 'text-neutral-600 dark:text-neutral-400' }, tier?.name ?? '—');
			},
		},
		{
			accessorKey: 'total_referrals_count',
			header: t('affiliate.referrals'),
			cell: ({ row }) => {
				return h('p', { class: 'text-neutral-600 dark:text-neutral-400' }, String(row.original.total_referrals_count ?? 0));
			},
		},
		{
			accessorKey: 'current_balance',
			header: t('affiliate.balance'),
			cell: ({ row }) => {
				const bal = row.original.current_balance ?? 0;
				return h('p', { class: 'font-medium text-neutral-900 dark:text-neutral-100' }, String(bal));
			},
		},
		{
			accessorKey: 'created_at',
			header: t('affiliate.createdAt'),
			cell: ({ row }) => {
				const date = row.original.created_at;
				const str = date ? new Date(date).toLocaleDateString() : '—';
				return h('p', { class: 'text-neutral-600 dark:text-neutral-400' }, str);
			},
		},
	];
}
