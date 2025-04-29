import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetPaymentTypeGroupsResp } from './models/response/payment-type';

class PaymentTypeModule extends HttpFactory {
	private GROUP_RESOURCE = MerchantRoutes.PaymentTypeGroups;

	async fetchMany(): Promise<GetPaymentTypeGroupsResp> {
		return await this.call<GetPaymentTypeGroupsResp>({
			method: 'GET',
			url: `${this.GROUP_RESOURCE.Many()}`,
		});
	}
}

export default PaymentTypeModule;
