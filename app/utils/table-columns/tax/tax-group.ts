import type { TableColumn } from '@nuxt/ui';
import type { TaxGroup } from '~/utils/types/tax-group';

export const tax_group_columns: TableColumn<TaxGroup>[] = [
	{
		accessorKey: 'code',
		header: 'Code',
		cell: ({ row }) => {
			return h('div', { class: 'flex-col-start' }, [
				h('h3', { class: 'text-neutral-800 font-bold' }, row.getValue('code')),
				h('h5', { class: 'text-neutral-400' }, row.getValue('description')),
			]);
		},
	},
	{
		accessorKey: 'taxes',
		header: 'Taxes',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('taxes'))]);
		},
	},
];
