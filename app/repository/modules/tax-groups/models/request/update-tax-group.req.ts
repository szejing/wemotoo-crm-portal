import type { TaxInput } from '~/utils/types/tax';

export type UpdateTaxGroupReq = {
	description: string;
	taxes: TaxInput[] | undefined;
};
