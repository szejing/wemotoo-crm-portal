import type { OrderItemModel } from '~/utils/models/item.model';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { CustomerModel, OrderPaymentModel } from '~/utils/models';
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

	/**
	 * Updates Payment status
	 * @returns
	 */
	async updatePaymentStatus(orderNo: string, customerNo: string, paymentStatus: string): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			body: { order_no: orderNo, customer_no: customerNo, payment_status: paymentStatus },
		});
	}

	/**
	 * Updates customer
	 * @returns
	 */
	async updateCustomer(order_no: string, customer: CustomerModel): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			body: { order_no, customer_no: customer.customer_no, customer },
		});
	}

	/**
	 * Updates payment
	 * @returns
	 */
	async updatePayment(order_no: string, customer_no: string, payments: OrderPaymentModel[]): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			body: { order_no, customer_no, payments },
		});
	}

	/**
	 * Updates item
	 * @returns
	 */
	async updateItem(order_no: string, customer_no: string, items: OrderItemModel[]): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			body: { order_no, customer_no, items },
		});
	}
}

export default OrderModule;
