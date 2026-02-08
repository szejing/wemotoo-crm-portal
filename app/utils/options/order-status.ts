import { OrderStatus } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export const options_order_status = [
	'All',
	OrderStatus.PENDING_PAYMENT,
	OrderStatus.CANCELLED,
	OrderStatus.REFUNDED,
	OrderStatus.COMPLETED,
	OrderStatus.REQUIRES_ACTION,
];

export function getOrderStatusOptions(t: TranslateFn) {
	return [
		{ value: 'All', label: t('options.all') },
		{ value: OrderStatus.PENDING_PAYMENT, label: t('options.pendingPayment') },
		{ value: OrderStatus.CANCELLED, label: t('options.cancelled') },
		{ value: OrderStatus.REFUNDED, label: t('options.refunded') },
		{ value: OrderStatus.COMPLETED, label: t('options.completed') },
		{ value: OrderStatus.REQUIRES_ACTION, label: t('options.requiresAction') },
	];
}

export const getOrderStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[OrderStatus.PENDING_PAYMENT]: 'info',
		[OrderStatus.CANCELLED]: 'error',
		[OrderStatus.REFUNDED]: 'error',
		[OrderStatus.COMPLETED]: 'success',
		[OrderStatus.REQUIRES_ACTION]: 'warning',
		[OrderStatus.PROCESSING]: 'info',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
