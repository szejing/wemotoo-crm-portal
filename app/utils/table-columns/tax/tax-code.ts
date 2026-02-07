import { USwitch } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { Tax } from '~/utils/types/tax';
import type { TableColumnsTranslate } from '../brand';

export function getTaxCodeColumns(t: TableColumnsTranslate): TableColumn<Tax>[] {
	return [
		{
			accessorKey: 'code',
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.code')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
					h('h5', { class: 'text-neutral-400' }, row.original.description),
				]);
			},
		},
		{
			accessorKey: 'type',
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.taxType')),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1 text-neutral-900' }, [h('h5', row.original.is_inclusive ? t('table.inclusive') : t('table.exclusive'))]);
			},
		},
		{
			accessorKey: 'is_active',
			header: () => h('h1', { class: 'text-neutral-400' }, t('table.active')),
			cell: ({ row }) => {
				const taxStore = useTaxStore();
				return h(USwitch, {
					'class': 'size-5',
					'modelValue': row.original.is_active,
					'disabled': false,
					'onUpdate:modelValue': (value: boolean) => taxStore.updateStatus(row.original, value),
				});
			},
		},
	];
}
