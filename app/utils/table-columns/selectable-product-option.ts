import { UCheckbox, UIcon } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { ProductOption } from '~/utils/types/product-option';

export const selectable_product_option_columns: TableColumn<ProductOption>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			h(UCheckbox, {
				'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
				'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all',
			}),
		cell: ({ row }) =>
			h(UCheckbox, {
				'modelValue': row.getIsSelected(),
				'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
				'aria-label': 'Select row',
			}),
	},
	{
		accessorKey: 'name',
		header: () => h('span', { class: 'text-xs font-semibold text-neutral-700 uppercase tracking-wider' }, 'Option Name'),
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [
				h('div', [
					h('p', { class: 'text-sm font-semibold text-neutral-900' }, row.original.name),
					h('p', { class: 'text-xs text-neutral-500' }, `${row.original.values?.length || 0} ${row.original.values?.length === 1 ? 'value' : 'values'}`),
				]),
			]);
		},
	},
	{
		accessorKey: 'values',
		header: () => h('span', { class: 'text-xs font-semibold text-neutral-700 uppercase tracking-wider' }, 'Values'),
		cell: ({ row }) => {
			if (!row.original.values || row.original.values.length === 0) {
				return h('div', { class: 'flex items-center gap-1.5 text-xs text-amber-600' }, [
					h(UIcon, { name: 'i-heroicons-exclamation-triangle', class: 'w-3 h-3' }),
					h('span', 'No values'),
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
