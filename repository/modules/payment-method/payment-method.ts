import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetPaymentMethodsResp } from './models/response/payment-method';

class PaymentMethodModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.PaymentMethods;

	async fetchMany(): Promise<GetPaymentMethodsResp> {
		return await this.call<GetPaymentMethodsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async updateStatus(code: string, is_active: boolean) {
		return await this.call<GetPaymentMethodsResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: {
				is_active,
			},
		});
	}
}

export default PaymentMethodModule;
