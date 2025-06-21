import type { Tax } from '~/utils/types/tax';

export type TaxesResp = {
	count: number;
	taxes: Tax[];
};
