import { SaleStatus } from 'wemotoo-common';

export const options_sale_status = ['All', SaleStatus.COMPLETED, SaleStatus.CANCELLED, SaleStatus.REFUNDED];

export const getSaleStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[SaleStatus.COMPLETED]: 'success',
		[SaleStatus.CANCELLED]: 'error',
		[SaleStatus.REFUNDED]: 'error',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
