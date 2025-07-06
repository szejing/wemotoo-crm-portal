import type { BaseODataReq } from '~/repository/base/base.req';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetDashboardSummResp } from './models/response';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { GetDashboardSummReq } from './models/request';
import type { SummOrderBill, SummOrderCustomer, SummOrderItem } from '~/utils/types/summ-orders';

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
	async getSummOrders(query: BaseODataReq): Promise<BaseODataResp<SummOrderBill>> {
		return await this.call<BaseODataResp<SummOrderBill>>({
			method: 'GET',
			url: `${this.RESOURCE.Orders()}`,
			query,
		});
	}

	/**
	 * Fetches summ order items
	 * @returns
	 */
	async getSummOrderItems(query: BaseODataReq): Promise<BaseODataResp<SummOrderItem>> {
		return await this.call<BaseODataResp<SummOrderItem>>({
			method: 'GET',
			url: `${this.RESOURCE.Items()}`,
			query,
		});
	}

	/**
	 * Fetches summ order customers
	 * @returns
	 */
	async getSummOrderCustomers(query: BaseODataReq): Promise<BaseODataResp<SummOrderCustomer>> {
		return await this.call<BaseODataResp<SummOrderCustomer>>({
			method: 'GET',
			url: `${this.RESOURCE.Customers()}`,
			query,
		});
	}
}

export default OrderSummaryModule;
