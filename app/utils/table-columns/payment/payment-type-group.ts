import type { TableColumn } from '@nuxt/ui';
import type { TableColumnsTranslate } from '../brand';

export function getPaymentTypeGroupColumns(t: TableColumnsTranslate): TableColumn<any>[] {
	return [
		{
			accessorKey: 'index',
			header: () => h('div', { class: 'text-neutral-400' }, t('table.no')),
			cell: ({ row }) => {
				return h('p', { class: 'text-neutral-900' }, row.index + 1);
			},
		},
		{
			accessorKey: 'code',
			header: () => h('div', { class: 'text-neutral-400' }, t('table.groupCode')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
					h('h5', { class: 'text-neutral-400' }, row.original.short_desc),
				]);
			},
		},
	];
}
