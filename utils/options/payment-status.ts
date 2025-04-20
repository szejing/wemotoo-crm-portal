import { PaymentStatus } from 'wemotoo-common';

export const options_payment_status = [
	PaymentStatus.PENDING,
	PaymentStatus.SUCCESS,
	PaymentStatus.FAILED,
	PaymentStatus.REFUNDED,
	PaymentStatus.PARTIALLY_REFUNDED,
	PaymentStatus.PARTIALLY_PAID,
];
