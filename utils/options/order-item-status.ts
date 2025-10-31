import { OrderItemStatus } from 'wemotoo-common';

export const options_order_item_status = ['All', OrderItemStatus.ACTIVE, OrderItemStatus.REFUNDED, OrderItemStatus.VOIDED];

export const getOrderItemStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[OrderItemStatus.ACTIVE]: 'success',
		[OrderItemStatus.REFUNDED]: 'error',
		[OrderItemStatus.VOIDED]: 'error',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
