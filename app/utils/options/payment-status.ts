import { PaymentStatus } from 'wemotoo-common';

export const options_payment_status = [
	PaymentStatus.PAID,
	PaymentStatus.PENDING,
	PaymentStatus.PARTIALLY_PAID,
	PaymentStatus.PARTIALLY_REFUNDED,
	PaymentStatus.REFUNDED,
];

export const getPaymentStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[PaymentStatus.PAID]: 'success',
		[PaymentStatus.PENDING]: 'info',
		[PaymentStatus.PARTIALLY_PAID]: 'warning',
		[PaymentStatus.PARTIALLY_REFUNDED]: 'warning',
		[PaymentStatus.REFUNDED]: 'error',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
