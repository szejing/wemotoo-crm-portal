import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetPaymentMethodsReq, UpdatePaymentMethodReq } from './models/request/payment-method';
import type { GetPaymentMethodsResp } from './models/response/payment-method';

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
