import { SaleStatus } from 'wemotoo-common';
import type { TranslateFn } from './order-status';

export const options_sale_status = ['All', SaleStatus.COMPLETED, SaleStatus.CANCELLED, SaleStatus.REFUNDED];

export function getSaleStatusOptions(t: TranslateFn) {
	return [
		{ value: 'All', label: t('options.all') },
		{ value: SaleStatus.COMPLETED, label: t('options.completed') },
		{ value: SaleStatus.CANCELLED, label: t('options.cancelled') },
		{ value: SaleStatus.REFUNDED, label: t('options.refunded') },
	];
}

export const getSaleStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[SaleStatus.COMPLETED]: 'success',
		[SaleStatus.CANCELLED]: 'error',
		[SaleStatus.REFUNDED]: 'error',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
