import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { Currency } from '~/utils/types/currency';

type CurrenciesResp = {
	count: number;
	currencies: Currency[];
};

class CurrencyModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Currencies;

	/**
	 * Fetches all currencies
	 * @returns
	 */
	async getCurrencies(): Promise<CurrenciesResp> {
		return await this.call<CurrenciesResp>({
			method: 'GET',
			query: { is_active: true },
			url: `${this.RESOURCE.Many()}`,
		});
	}
}

export default CurrencyModule;
