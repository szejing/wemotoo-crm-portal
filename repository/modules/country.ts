import type { Country } from '~/utils/types/country';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type CountriesResp = {
	count: number;
	countries: Country[];
};

class CountryModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Countries;

	/**
	 * Fetches all Countries
	 * @returns
	 */
	async getCountries(): Promise<CountriesResp> {
		return await this.call<CountriesResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}
}

export default CountryModule;
