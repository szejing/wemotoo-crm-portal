import type { TranslateFn } from './order-status';

export const options_account_status = [
	{ name: 'New', value: 0 },
	{ name: 'Active', value: 1 },
	{ name: 'Inactive', value: 2 },
	{ name: 'Expired', value: 3 },
];

export function getAccountStatusOptions(t: TranslateFn) {
	return [
		{ value: 0, label: t('options.new') },
		{ value: 1, label: t('options.active') },
		{ value: 2, label: t('options.inactive') },
		{ value: 3, label: t('options.expired') },
	];
}
