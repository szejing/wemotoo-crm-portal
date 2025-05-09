import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetPaymentTypeGroupsReq } from './models/request/get-payment-type-group.req';
import type { GetPaymentTypeGroupsResp } from './models/response/get-payment-type-group.resp';

class PaymentTypeGroupModule extends HttpFactory {
	private GROUP_RESOURCE = MerchantRoutes.PaymentTypeGroups;

	async fetchMany(request?: GetPaymentTypeGroupsReq): Promise<GetPaymentTypeGroupsResp> {
		return await this.call<GetPaymentTypeGroupsResp>({
			method: 'GET',
			url: `${this.GROUP_RESOURCE.Many()}`,
			query: request,
		});
	}
}

export default PaymentTypeGroupModule;
