import type { ItemModel } from '~/utils/models/item.model';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { CustomerModel, PaymentModel } from '~/utils/models';
import type { GetOrdersReq } from './models/request/get-order.req';
import type { GetOrderResp } from './models/response/get-order.resp';
import type { GetOrdersResp } from './models/response/get-orders.resp';
import type { UpdateOrderStatusResp } from './models/response/update-order.resp';

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
	async getOrderByOrderNo(order_no: string): Promise<GetOrderResp> {
		return await this.call<GetOrderResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(order_no)}`,
		});
	}

	/**
	 * Updates order status
	 * @returns
	 */
	async updateOrderStatus(orderNo: string, customerNo: string, orderStatus: string): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderStatus(orderNo)}`,
			body: { order_no: orderNo, customer_no: customerNo, status: orderStatus },
		});
	}

	/**
	 * Update Order
	 * @returns
	 */
	async updateOrder(order_no: string, customer_no: string, payment_status: string): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(order_no)}`,
			body: { order_no, customer_no, payment_status },
		});
	}

	/**
	 * Updates customer
	 * @returns
	 */
	async updateCustomer(order_no: string, customer: CustomerModel): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderCustomer(order_no)}`,
			body: { order_no, customer_no: customer.customer_no, customer },
		});
	}

	/**
	 * Updates payment
	 * @returns
	 */
	async updatePayments(order_no: string, customer_no: string, payments: PaymentModel[]): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderPayments(order_no)}`,
			body: { order_no, customer_no, payments },
		});
	}

	/**
	 * Updates item
	 * @returns
	 */
	async updateItems(order_no: string, customer_no: string, items: ItemModel[]): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderItems(order_no)}`,
			body: { order_no, customer_no, items },
		});
	}
}

export default OrderModule;
