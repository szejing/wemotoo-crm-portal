import { OrderStatus } from 'wemotoo-common';

export const options_order_status = [
	'All',
	OrderStatus.PENDING_PAYMENT,
	OrderStatus.CANCELLED,
	OrderStatus.REFUNDED,
	OrderStatus.COMPLETED,
	OrderStatus.REQUIRES_ACTION,
];

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
