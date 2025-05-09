import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetPaymentMethodsReq } from './models/request/get-payment-methods.req';
import type { UpdatePaymentMethodReq } from './models/request/update-payment-method.req';
import type { GetPaymentMethodsResp } from './models/response/get-payment-methods.resp';

class PaymentMethodModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.PaymentMethods;

	async fetchMany(request?: GetPaymentMethodsReq): Promise<GetPaymentMethodsResp> {
		return await this.call<GetPaymentMethodsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query: request,
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
