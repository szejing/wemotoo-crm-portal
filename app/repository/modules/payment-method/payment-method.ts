import type { PaymentMethod } from '~/utils/types/payment-method';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type {
	UpdatePaymentMethodBody,
	UpdatePaymentMethodReq,
} from './models/request/update-payment-method.req';
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

	async update(code: string, body: UpdatePaymentMethodBody) {
		return await this.call<{ payment_method: PaymentMethod }>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body,
		});
	}

	async updateStatus(request: UpdatePaymentMethodReq) {
		return this.update(request.code, { is_active: request.is_active });
	}
}

export default PaymentMethodModule;
