import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CustomersResp } from './models/response/customers.resp';
import type { CustomerResp } from './models/response/customer.resp';

class CustomerModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Customers;

	async getMany(): Promise<CustomersResp> {
		return await this.call<CustomersResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async getSingle(cust_no: string): Promise<CustomerResp> {
		return await this.call<CustomerResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(cust_no)}`,
		});
	}
}

export default CustomerModule;
