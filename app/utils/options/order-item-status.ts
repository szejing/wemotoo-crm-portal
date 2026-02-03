import { OrderItemStatus } from 'wemotoo-common';
import type { TranslateFn } from './order-status';

export const options_order_item_status = ['All', OrderItemStatus.ACTIVE, OrderItemStatus.REFUNDED, OrderItemStatus.VOIDED];

export function getOrderItemStatusOptions(t: TranslateFn) {
	return [
		{ value: 'All', label: t('options.all') },
		{ value: OrderItemStatus.ACTIVE, label: t('options.active') },
		{ value: OrderItemStatus.REFUNDED, label: t('options.refunded') },
		{ value: OrderItemStatus.VOIDED, label: t('options.voided') },
	];
}

export const getOrderItemStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[OrderItemStatus.ACTIVE]: 'success',
		[OrderItemStatus.REFUNDED]: 'error',
		[OrderItemStatus.VOIDED]: 'error',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
