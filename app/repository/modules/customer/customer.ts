import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CustomerResp } from './models/response/customer.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Customer } from '~/utils/types/customer';

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
}

export default CustomerModule;
