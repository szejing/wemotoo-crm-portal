import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Currency } from '~/utils/types/currency';

class CurrencyModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Currencies;

	/**
	 * Fetches all currencies
	 * @returns
	 */
	async getCurrencies(query: BaseODataReq): Promise<BaseODataResp<Currency>> {
		return await this.call<BaseODataResp<Currency>>({
			method: 'GET',
			query,
			url: `${this.RESOURCE.Many()}`,
		});
	}
}

export default CurrencyModule;
