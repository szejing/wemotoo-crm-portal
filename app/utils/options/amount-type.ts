import { AmountType } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export const options_amount_type = [AmountType.GROSS_AMOUNT, AmountType.NET_AMOUNT];

export function getAmountTypeOptions(t: TranslateFn) {
	return [
		{ value: AmountType.GROSS_AMOUNT, label: t('options.grossAmount') },
		{ value: AmountType.NET_AMOUNT, label: t('options.netAmount') },
	];
}
