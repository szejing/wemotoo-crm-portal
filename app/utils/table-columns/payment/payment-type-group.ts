import type { TableColumn } from '@nuxt/ui';

type TranslateFn = (key: string) => string;

export function getPaymentTypeGroupColumns(t: TranslateFn): TableColumn<any>[] {
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
				return h('div', [
					h('div', { class: 'font-semibold text-sm text-neutral-900 dark:text-neutral-100' }, row.original.short_desc),
					h('div', { class: 'text-xs text-neutral-400 dark:text-neutral-500 font-mono italic' }, row.original.code),
				]);
			},
		},
	];
}
