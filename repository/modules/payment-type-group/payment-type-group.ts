import type { BaseODataReq } from '~/repository/base/base.req';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { PaymentTypeGroup } from '~/utils/types/payment-type';

class PaymentTypeGroupModule extends HttpFactory {
	private GROUP_RESOURCE = MerchantRoutes.PaymentTypeGroups;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<PaymentTypeGroup>> {
		return await this.call<BaseODataResp<PaymentTypeGroup>>({
			method: 'GET',
			url: `${this.GROUP_RESOURCE.Many()}`,
			query,
		});
	}
}

export default PaymentTypeGroupModule;
