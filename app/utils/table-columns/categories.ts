import type { TableColumn } from '@nuxt/ui';
import { UBadge, UButton } from '#components';
import type { Category } from '~/utils/types/category';
import type { TableColumnsTranslate } from './brand';

export function getCategoryColumns(t: TableColumnsTranslate): TableColumn<Category>[] {
	return [
		{
			accessorKey: 'code',
			header: () => h('h1', t('table.code')),
			cell: ({ row }) => {
				return h('div', [
					h('div', { class: 'font-bold text-neutral-900' }, row.original.code),
					h('div', { class: 'text-neutral-600' }, row.original.description),
				]);
			},
		},
		{
			accessorKey: 'total_items',
			header: () => h('div', { class: 'flex justify-end w-full' }, [h('h1', t('table.noOfItems'))]),
			cell: ({ row }) => {
				return h('div', { class: 'flex justify-end w-full' }, [
					h('div', { class: 'text-center', style: 'min-width: 90px' }, [h('p', { class: 'text-neutral-900' }, row.original.total_products)]),
				]);
			},
		},
	];
}

/** Columns for tree table: expand + indent, then code, then count. */
export function getCategoryTreeColumns(t: TableColumnsTranslate): TableColumn<Category>[] {
	return [
		{
			id: 'category',
			header: () => h('h1', t('table.code')),
			cell: ({ row }) => {
				const depth = row.depth;
				const isParent = row.getCanExpand();
				const isExpanded = row.getIsExpanded();
				const isRoot = depth === 0;

				// Typography weight/color by depth
				const nameClass = isRoot ? 'font-bold text-highlighted' : depth === 1 ? 'font-semibold text-highlighted' : 'font-medium text-muted';

				const descClass = isRoot ? 'text-muted text-sm' : 'text-dimmed text-xs';

				// Active/inactive dot
				const statusDot = h('span', {
					class: ['inline-block size-2 rounded-full flex-shrink-0', row.original.is_active !== false ? 'bg-success-500' : 'bg-neutral-300 dark:bg-neutral-600'],
					title: row.original.is_active !== false ? t('common.active') : t('common.inactive'),
				});

				// Internal badge
				const internalBadge = row.original.is_internal ? h(UBadge, { variant: 'subtle', color: 'warning', size: 'xs' }, () => 'Internal') : null;

				return h(
					'div',
					{
						style: { paddingLeft: `${depth * 1.5}rem` },
						class: 'flex items-center gap-2 py-0.5',
					},
					[
						// Expand/collapse chevron (or spacer for leaves)
						isParent
							? h(UButton, {
									color: isExpanded ? 'primary' : 'neutral',
									variant: 'ghost',
									size: 'xs',
									icon: isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right',
									ui: {
										base: 'p-0.5 rounded transition-transform duration-150',
										leadingIcon: 'size-4',
									},
									onClick: (e: Event) => {
										e.stopPropagation();
										row.getToggleExpandedHandler()();
									},
								})
							: h('span', { class: 'w-6' }),

						// Thumbnail (if available)
						row.original.thumbnail?.url
							? h('img', {
									src: row.original.thumbnail.url,
									alt: row.original.code,
									class: 'size-8 rounded object-cover flex-shrink-0 border border-default',
								})
							: null,

						// Description (primary), code (secondary), badges
						h('div', { class: 'flex-1 min-w-0' }, [
							h('div', { class: 'flex items-center gap-1.5' }, [
								statusDot,
								h('span', { class: nameClass }, row.original.description || row.original.code),
								internalBadge,
							]),
							h('p', { class: `truncate ${descClass}` }, row.original.code),
						]),
					],
				);
			},
		},
		{
			accessorKey: 'total_products',
			header: () => h('div', { class: 'flex justify-end w-full' }, [h('h1', t('table.noOfItems'))]),
			meta: {
				class: {
					th: 'text-right',
					td: 'text-right',
				},
			},
			cell: ({ row }) => {
				const count = row.original.total_products ?? 0;
				return h(
					UBadge,
					{
						variant: 'subtle',
						color: count > 0 ? 'primary' : 'neutral',
						size: 'lg',
					},
					() => String(count),
				);
			},
		},
	];
}
