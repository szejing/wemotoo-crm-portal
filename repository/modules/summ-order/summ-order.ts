import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetDashboardSummReq, GetSummOrderBillsReq, GetSummOrderCustomersReq, GetSummOrderItemsReq } from './models/request';
import type { GetDashboardSummResp, GetSummOrderBillsResp, GetSummOrderItemsResp, GetSummOrderCustomersResp } from './models/response';

class OrderSummaryModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.SummOrders;

	/**
	 * Fetches dashboard order summary
	 * @returns
	 */
	async getDashboardOrderSummary(query: GetDashboardSummReq): Promise<GetDashboardSummResp> {
		return await this.call<GetDashboardSummResp>({
			method: 'GET',
			url: `${this.RESOURCE.Dashboard()}`,
			query,
		});
	}

	/**
	 * Fetches summ orders
	 * @returns
	 */
	async getSummOrders(query: GetSummOrderBillsReq): Promise<GetSummOrderBillsResp> {
		return await this.call<GetSummOrderBillsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Orders()}`,
			query,
		});
	}

	/**
	 * Fetches summ order items
	 * @returns
	 */
	async getSummOrderItems(query: GetSummOrderItemsReq): Promise<GetSummOrderItemsResp> {
		return await this.call<GetSummOrderItemsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Items()}`,
			query,
		});
	}

	/**
	 * Fetches summ order customers
	 * @returns
	 */
	async getSummOrderCustomers(query: GetSummOrderCustomersReq): Promise<GetSummOrderCustomersResp> {
		return await this.call<GetSummOrderCustomersResp>({
			method: 'GET',
			url: `${this.RESOURCE.Customers()}`,
			query,
		});
	}
}

export default OrderSummaryModule;
