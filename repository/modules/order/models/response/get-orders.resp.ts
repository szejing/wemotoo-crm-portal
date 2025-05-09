import type { Order } from './order';

export type GetOrdersResp = {
	orders: Order[];
	total: number;
};
