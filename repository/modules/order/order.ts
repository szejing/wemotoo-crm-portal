import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetOrdersReq } from './models/request/order';
import type { GetOrderResp, GetOrdersResp, UpdateOrderStatusResp } from './models/response/order';

class OrderModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Orders;

	/**
	 * Fetches all orders
	 * @returns
	 */
	async getOrders(query: GetOrdersReq): Promise<GetOrdersResp> {
		return await this.call<GetOrdersResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	/**
	 * Fetches order by order no
	 * @returns
	 */
	async getOrderByOrderNo(orderNo: string): Promise<GetOrderResp> {
		return await this.call<GetOrderResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(orderNo)}`,
		});
	}

	/**
	 * Updates order status
	 * @returns
	 */
	async updateOrderStatus(orderNo: string, customerNo: string, orderStatus: string): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			body: { order_no: orderNo, customer_no: customerNo, order_status: orderStatus },
		});
	}
}

export default OrderModule;
