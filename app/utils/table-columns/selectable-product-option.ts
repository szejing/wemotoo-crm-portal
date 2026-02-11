import { UCheckbox, UIcon } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { ProductOption } from '~/utils/types/product-option';

type TranslateFn = (key: string) => string;

export function getSelectableProductOptionColumns(t: TranslateFn): TableColumn<ProductOption>[] {
	return [
		{
			id: 'select',
			header: ({ table }) =>
				h(UCheckbox, {
					'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
					'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
					'aria-label': t('table.selectAll'),
				}),
			cell: ({ row }) =>
				h(UCheckbox, {
					'modelValue': row.getIsSelected(),
					'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
					'aria-label': t('table.selectRow'),
				}),
		},
		{
			accessorKey: 'name',
			header: () => h('span', { class: 'text-xs font-semibold text-neutral-700 uppercase tracking-wider' }, t('table.optionName')),
			cell: ({ row }) => {
				const count = row.original.values?.length || 0;
				const valueLabel = count === 1 ? t('table.value') : t('table.values');
				return h('div', { class: 'flex items-center gap-2' }, [
					h('div', [
						h('p', { class: 'text-sm font-semibold text-neutral-900' }, row.original.name),
						h('p', { class: 'text-xs text-neutral-500' }, `${count} ${valueLabel}`),
					]),
				]);
			},
		},
		{
			accessorKey: 'values',
			header: () => h('span', { class: 'text-xs font-semibold text-neutral-700 uppercase tracking-wider' }, t('table.values')),
			cell: ({ row }) => {
				if (!row.original.values || row.original.values.length === 0) {
					return h('div', { class: 'flex items-center gap-1.5 text-xs text-amber-600' }, [
						h(UIcon, { name: 'i-heroicons-exclamation-triangle', class: 'w-3 h-3' }),
						h('span', t('table.noValues')),
					]);
				}

				return h(
					'div',
					{ class: 'flex flex-wrap gap-1.5' },
					row.original.values.map((value) =>
						h(
							'span',
							{ class: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200' },
							value.value,
						),
					),
				);
			},
		},
	];
}
