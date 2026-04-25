import { OrderStatus } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export type UiOrderStatus = OrderStatus | 'paid' | 'shipped' | 'delivered';

export const options_order_status: Array<'All' | UiOrderStatus> = [
	'All',
	OrderStatus.PENDING_PAYMENT,
	'paid',
	OrderStatus.PROCESSING,
	'shipped',
	'delivered',
	OrderStatus.CANCELLED,
	OrderStatus.REFUNDED,
	OrderStatus.COMPLETED,
	OrderStatus.REQUIRES_ACTION,
];

export function getOrderStatusOptions(t: TranslateFn) {
	return [
		{ value: 'All', label: t('options.all') },
		{ value: OrderStatus.PENDING_PAYMENT, label: t('options.pendingPayment') },
		{ value: 'paid', label: t('options.paid') },
		{ value: OrderStatus.PROCESSING, label: t('options.processing') },
		{ value: 'shipped', label: t('options.shipped') },
		{ value: 'delivered', label: t('options.delivered') },
		{ value: OrderStatus.CANCELLED, label: t('options.cancelled') },
		{ value: OrderStatus.REFUNDED, label: t('options.refunded') },
		{ value: OrderStatus.COMPLETED, label: t('options.completed') },
		{ value: OrderStatus.REQUIRES_ACTION, label: t('options.requiresAction') },
	];
}

export const getOrderStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[OrderStatus.PENDING_PAYMENT]: 'warning',
		paid: 'info',
		[OrderStatus.PROCESSING]: 'info',
		shipped: 'primary',
		delivered: 'success',
		[OrderStatus.CANCELLED]: 'error',
		[OrderStatus.REFUNDED]: 'error',
		[OrderStatus.COMPLETED]: 'success',
		[OrderStatus.REQUIRES_ACTION]: 'warning',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
