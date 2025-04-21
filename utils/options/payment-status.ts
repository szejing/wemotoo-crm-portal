import { PaymentStatus } from 'wemotoo-common';

export const options_payment_status = [
	PaymentStatus.SUCCESS,
	PaymentStatus.PENDING,
	PaymentStatus.FAILED,
	PaymentStatus.REFUNDED,
	PaymentStatus.PARTIALLY_REFUNDED,
	PaymentStatus.PARTIALLY_PAID,
];
