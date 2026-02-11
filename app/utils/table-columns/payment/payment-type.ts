import type { ColumnDef } from '@tanstack/vue-table';

type TranslateFn = (key: string) => string;

export function getPaymentTypeColumns(t: TranslateFn): ColumnDef<any>[] {
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
