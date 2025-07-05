import type { PaymentMethod } from '~/utils/types/payment-method';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { UpdatePaymentMethodReq } from './models/request/update-payment-method.req';
import type { GetPaymentMethodsResp } from './models/response/get-payment-methods.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';

class PaymentMethodModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.PaymentMethods;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<PaymentMethod>> {
		return await this.call<BaseODataResp<PaymentMethod>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async updateStatus(request: UpdatePaymentMethodReq) {
		return await this.call<GetPaymentMethodsResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(request.code)}`,
			body: {
				is_active: request.is_active,
			},
		});
	}
}

export default PaymentMethodModule;
