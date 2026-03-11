import { UButton } from '#components';
import type { Column } from '@tanstack/vue-table';
import { h } from 'vue';

export function getSortableHeader<TData>(column: Column<TData, unknown>, label: string) {
	const isSorted = column.getIsSorted();

	return h(UButton, {
		color: 'neutral',
		variant: 'ghost',
		label,
		icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
		class: '-mx-2.5',
		onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
	});
}
