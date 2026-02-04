import { PaymentStatus } from 'wemotoo-common';
import type { TranslateFn } from './order-status';

export const options_payment_status = [
	PaymentStatus.PAID,
	PaymentStatus.PENDING,
	PaymentStatus.PARTIALLY_PAID,
	PaymentStatus.PARTIALLY_REFUNDED,
	PaymentStatus.REFUNDED,
];

export function getPaymentStatusOptions(t: TranslateFn) {
	return [
		{ value: PaymentStatus.PAID, label: t('options.paid') },
		{ value: PaymentStatus.PENDING, label: t('options.pending') },
		{ value: PaymentStatus.PARTIALLY_PAID, label: t('options.partiallyPaid') },
		{ value: PaymentStatus.PARTIALLY_REFUNDED, label: t('options.partiallyRefunded') },
		{ value: PaymentStatus.REFUNDED, label: t('options.refunded') },
	];
}

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
