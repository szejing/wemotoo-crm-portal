import type { ItemModel } from '~/utils/models/item.model';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { CustomerModel, PaymentModel } from '~/utils/models';
import type { GetOrderResp } from './models/response/get-order.resp';
import type { UpdateOrderStatusResp } from './models/response/update-order.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Order } from '~/utils/types/order';

class OrderModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Orders;

	/**
	 * Fetches all orders
	 * @returns
	 */
	async getOrders(query: BaseODataReq): Promise<BaseODataResp<Order>> {
		return await this.call<BaseODataResp<Order>>({
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
			url: `${this.RESOURCE.Single(encodeURIComponent(order_no))}`,
		});
	}

	/**
	 * Updates order status
	 * @returns
	 */
	async updateOrderStatus(order_no: string, customer_no: string, status: string): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderStatus(encodeURIComponent(order_no))}`,
			body: { customer_no, status },
		});
	}

	/**
	 * Update Order
	 * @returns
	 */
	async updateOrder(order_no: string, customer_no: string, payment_status: string): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(encodeURIComponent(order_no))}`,
			body: { customer_no, payment_status },
		});
	}

	/**
	 * Updates customer
	 * @returns
	 */
	async updateCustomer(order_no: string, customer: CustomerModel): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderCustomer(encodeURIComponent(order_no))}`,
			body: { customer_no: customer.customer_no, customer },
		});
	}

	/**
	 * Updates payment
	 * @returns
	 */
	async updatePayments(order_no: string, customer_no: string, payments: PaymentModel[]): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderPayments(encodeURIComponent(order_no))}`,
			body: { customer_no, payments },
		});
	}

	/**
	 * Updates item
	 * @returns
	 */
	async updateItems(order_no: string, customer_no: string, items: ItemModel[]): Promise<UpdateOrderStatusResp> {
		return await this.call<UpdateOrderStatusResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateOrderItems(encodeURIComponent(order_no))}`,
			body: { customer_no, items },
		});
	}
}

export default OrderModule;
