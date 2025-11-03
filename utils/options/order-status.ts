import { OrderStatus } from 'wemotoo-common';

export const options_order_status = [
	'All',
	OrderStatus.PENDING_PAYMENT,
	OrderStatus.PROCESSING,
	OrderStatus.COMPLETED,
	OrderStatus.CANCELLED,
	OrderStatus.REFUNDED,
	OrderStatus.REQUIRES_ACTION,
];
