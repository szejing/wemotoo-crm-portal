import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CustomerResp } from './models/response/customer.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Customer } from '~/utils/types/customer';
import type { OrderHistory } from '~/utils/types/order-history';
import type { UpdateCustomerInsightsReq } from './models/request/customer-insights.req';

class CustomerModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Customers;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<Customer>> {
		return await this.call<BaseODataResp<Customer>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async getSingle(cust_no: string): Promise<CustomerResp> {
		return await this.call<CustomerResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(cust_no)}`,
		});
	}

	async getOrders(cust_no: string): Promise<BaseODataResp<OrderHistory>> {
		return await this.call<BaseODataResp<OrderHistory>>({
			method: 'GET',
			url: `${this.RESOURCE.Orders(cust_no)}`,
		});
	}

	async updateInsights(cust_no: string, body: UpdateCustomerInsightsReq): Promise<CustomerResp> {
		return await this.call<CustomerResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.UpdateInsights(cust_no)}`,
			body,
		});
	}
}

export default CustomerModule;
