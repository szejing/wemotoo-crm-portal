import type { TaxInput } from '../../tax';

export type TaxGroupCreate = {
	code: string | undefined;
	description: string | undefined;
	taxes: TaxInput[] | undefined;
};
