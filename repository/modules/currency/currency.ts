import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { GetCurrenciesResp } from './models/response/get-currencies.resp';

class CurrencyModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Currencies;

	/**
	 * Fetches all currencies
	 * @returns
	 */
	async getCurrencies(): Promise<GetCurrenciesResp> {
		return await this.call<GetCurrenciesResp>({
			method: 'GET',
			query: { is_active: true },
			url: `${this.RESOURCE.Many()}`,
		});
	}
}

export default CurrencyModule;
