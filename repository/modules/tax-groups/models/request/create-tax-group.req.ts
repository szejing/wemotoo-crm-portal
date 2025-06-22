import type { TaxInput } from '~/utils/types/tax';

export type CreateTaxGroupReq = {
	code: string | undefined;
	description: string | undefined;
	taxes: TaxInput[] | undefined;
};
