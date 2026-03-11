import type { TableColumn } from '@nuxt/ui';
import type { TaxGroup } from '~/utils/types/tax-group';
import { getSortableHeader } from '../sortable';

type TranslateFn = (key: string) => string;

export function getTaxGroupColumns(t: TranslateFn): TableColumn<TaxGroup>[] {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				return h('div', { class: 'flex-col-start' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.getValue('code')),
					h('h5', { class: 'text-neutral-400' }, row.getValue('description')),
				]);
			},
		},
		{
			accessorKey: 'taxes',
			header: t('table.taxes'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900' }, row.getValue('taxes'))]);
			},
		},
	];
}
