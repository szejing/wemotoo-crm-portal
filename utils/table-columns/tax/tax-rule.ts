/* eslint-disable indent */
import type { TableColumn } from '@nuxt/ui';
import type { TaxRule } from '~/utils/types/tax-rule';

const getAmountTypeLabel = (amountType: string) => {
	const labels: Record<string, string> = {
		gross_amount: 'Gross Amt',
		net_amount: 'Net Amt',
	};
	return labels[amountType] || amountType;
};

export const tax_rule_columns: TableColumn<TaxRule>[] = [
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
		accessorKey: 'details',
		header: 'Details',
		cell: ({ row }) => {
			const details = row.getValue('details') as any[];

			if (!details || details.length === 0) {
				return h('div', { class: 'flex-col-start text-neutral-700 space-y-3' }, [h('div', { class: 'text-xs text-neutral-400' }, 'No details configured')]);
			}

			return h('div', { class: 'flex-col-start text-neutral-700 space-y-3' }, [
				h(
					'div',
					{ class: 'space-y-3' },
					details.map((detail) =>
						h('div', { class: 'text-sm' }, [
							h('div', { class: 'border-l-2 border-neutral-300 pl-2 space-y-1' }, [
								h('h4', { class: 'text-neutral-800 font-bold' }, detail.tax?.description || detail.description),
								detail.tax_condition
									? h('div', { class: 'flex items-center gap-2 mt-2' }, [
											h(resolveComponent('UBadge'), {
												label: getAmountTypeLabel(detail.tax_condition.amount_type),
												variant: 'soft',
												size: 'md',
											}),
											h(resolveComponent('UBadge'), {
												label: `${detail.tax_condition.rate * 100}%`,
												variant: 'soft',
												color: 'success',
												size: 'md',
											}),
										])
									: null,
							]),
						]),
					),
				),
			]);
		},
	},
];
