import type { TableColumn } from '@nuxt/ui';
import type { Outlet } from '~/utils/types/outlet';

type TranslateFn = (key: string) => string;

export function getOutletColumns(t: TranslateFn): TableColumn<Outlet>[] {
	return [
		{
			accessorKey: 'code',
			header: () => h('div', { class: 'flex justify-start w-full' }, [h('h1', t('table.code'))]),
			cell: ({ row }) => {
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
					h('h5', { class: 'text-neutral-400' }, row.original.description),
				]);
			},
		},
		{
			accessorKey: 'address',
			header: () => h('div', { class: 'flex justify-start w-full' }, [h('h1', t('table.address'))]),
			cell: ({ row }) => {
				const address = [row.original.address1, row.original.address2, row.original.address3].filter(Boolean).join(', ');
				const city = [row.original.city, row.original.postal_code, row.original.state, row.original.country_code].filter(Boolean).join(', ');
				return h('div', { class: 'flex flex-col gap-1 text-neutral-900' }, [h('p', address), h('p', city)]);
			},
		},
	];
}
