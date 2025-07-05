import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Country } from '~/utils/types/country';

class CountryModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Countries;

	/**
	 * Fetches all countries
	 * @returns
	 */
	async getCountries(query: BaseODataReq): Promise<BaseODataResp<Country>> {
		return await this.call<BaseODataResp<Country>>({
			method: 'GET',
			query,
			url: `${this.RESOURCE.Many()}`,
		});
	}
}

export default CountryModule;
