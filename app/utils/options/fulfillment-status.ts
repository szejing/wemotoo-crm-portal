import type { FulfillmentLifecycleStatusValue } from '~/utils/types/order-fulfillment-shipping';

type TranslateFn = (key: string) => string;

export const options_fulfillment_status: FulfillmentLifecycleStatusValue[] = [
	'pending',
	'processing',
	'packed',
	'fulfilled',
];

export function getFulfillmentStatusOptions(t: TranslateFn) {
	return [
		{ value: 'pending', label: t('options.pending') },
		{ value: 'processing', label: t('options.processing') },
		{ value: 'packed', label: t('options.packed') },
		{ value: 'fulfilled', label: t('options.fulfilled') },
	];
}

export const getFulfillmentStatusColor = (
	status: string,
): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		pending: 'warning',
		processing: 'info',
		packed: 'primary',
		fulfilled: 'success',
	};

	return color[status];
};
