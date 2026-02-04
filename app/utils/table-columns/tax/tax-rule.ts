/* eslint-disable indent */
import { UBadge } from '#components';
import type { TableColumn } from '@nuxt/ui';
import type { TaxRule } from '~/utils/types/tax-rule';
import type { TaxRuleDetail } from '~/utils/types/tax-rule-detail';
import type { TableColumnsTranslate } from '../brand';

function getAmountTypeLabel(amountType: string, t: TableColumnsTranslate): string {
	const keyMap: Record<string, string> = {
		gross_amount: 'table.grossAmt',
		net_amount: 'table.netAmt',
	};
	return keyMap[amountType] ? t(keyMap[amountType]) : amountType;
}

export function getTaxRuleColumns(t: TableColumnsTranslate): TableColumn<TaxRule>[] {
	return [
		{
			accessorKey: 'code',
			header: t('table.code'),
			cell: ({ row }) => {
				return h('div', { class: 'flex-col-start' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.getValue('code')),
					h('h5', { class: 'text-neutral-400' }, row.getValue('description')),
				]);
			},
		},
		{
			accessorKey: 'details',
			header: t('table.details'),
			cell: ({ row }) => {
				const details: TaxRuleDetail[] = row.original.details;

				if (!details || details.length === 0) {
					return h('div', { class: 'flex-col-start text-neutral-700 space-y-3' }, [
						h('div', { class: 'text-xs text-neutral-400' }, t('table.noDetailsConfigured')),
					]);
				}

				return h('div', { class: 'flex-col-start text-neutral-700 space-y-3' }, [
					h(
						'div',
						{ class: 'space-y-3' },
						details.map((detail) =>
							h('div', { class: 'text-sm' }, [
								h('div', { class: 'border-l-2 border-neutral-300 pl-2 space-y-1' }, [
									h('h4', { class: 'text-neutral-800 font-bold' }, `${detail.tax?.description} - ${detail.description}`),
									detail.tax_condition
										? h('div', { class: 'flex items-center gap-2 mt-2' }, [
												h(UBadge, {
													label: getAmountTypeLabel(detail.tax_condition.amount_type, t),
													variant: 'soft',
													size: 'md',
												}),
												h(UBadge, {
													label: `${detail.tax_condition.rate}%`,
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
}
