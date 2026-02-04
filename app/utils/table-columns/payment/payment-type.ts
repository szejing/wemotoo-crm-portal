import type { ColumnDef } from '@tanstack/vue-table';
import type { TableColumnsTranslate } from '../brand';

export function getPaymentTypeColumns(t: TableColumnsTranslate): ColumnDef<any>[] {
	return [
		{
			accessorKey: 'code',
			header: t('table.code'),
		},
		{
			accessorKey: 'desc',
			header: t('table.description'),
		},
		{
			accessorKey: 'short_desc',
			header: t('table.shortDescription'),
		},
	];
}
