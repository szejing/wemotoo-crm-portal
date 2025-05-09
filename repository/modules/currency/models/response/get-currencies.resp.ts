import type { Currency } from '~/utils/types/currency';

export type GetCurrenciesResp = {
	count: number;
	currencies: Currency[];
};
