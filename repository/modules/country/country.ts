import HttpFactory from '~/repository/factory';
import type { GetCountriesResp } from './models/response/get-countries.resp';
import MerchantRoutes from '~/repository/routes.client';

class CountryModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Countries;

	/**
	 * Fetches all countries
	 * @returns
	 */
	async getCountries(): Promise<GetCountriesResp> {
		return await this.call<GetCountriesResp>({
			method: 'GET',
			query: { is_active: true },
			url: `${this.RESOURCE.Many()}`,
		});
	}
}

export default CountryModule;
