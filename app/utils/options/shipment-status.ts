import type { ShipmentStatusValue } from '~/utils/types/order-fulfillment-shipping';

type TranslateFn = (key: string) => string;

export const options_shipment_status: ShipmentStatusValue[] = [
	'pending',
	'shipped',
	'in_transit',
	'delivered',
	'failed',
];

export function getShipmentStatusOptions(t: TranslateFn) {
	return [
		{ value: 'pending', label: t('options.pending') },
		{ value: 'shipped', label: t('options.shipped') },
		{ value: 'in_transit', label: t('options.inTransit') },
		{ value: 'delivered', label: t('options.delivered') },
		{ value: 'failed', label: t('options.failed') },
	];
}

export const getShipmentStatusColor = (
	status: string,
): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		pending: 'warning',
		shipped: 'primary',
		in_transit: 'info',
		delivered: 'success',
		failed: 'error',
	};

	return color[status];
};
