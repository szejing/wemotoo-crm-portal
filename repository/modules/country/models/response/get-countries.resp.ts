import type { Country } from '~/utils/types/country';

export type GetCountriesResp = {
	count: number;
	countries: Country[];
};
