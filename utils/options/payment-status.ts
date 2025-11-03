import { PaymentStatus } from 'wemotoo-common';

export const options_payment_status = [
	PaymentStatus.PAID,
	PaymentStatus.PENDING,
	PaymentStatus.REFUNDED,
	PaymentStatus.PARTIALLY_REFUNDED,
	PaymentStatus.PARTIALLY_PAID,
];
