import { OrderStatus } from 'wemotoo-common';

export const options_order_status = [
	OrderStatus.PENDING_PAYMENT,
	OrderStatus.COMPLETED,
	OrderStatus.ARCHIVED,
	OrderStatus.CANCELLED,
	OrderStatus.REFUNDED,
	OrderStatus.REQUIRES_ACTION,
	OrderStatus.PROCESSING,
];
