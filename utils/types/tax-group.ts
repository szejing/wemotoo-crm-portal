import type { Tax } from './tax';

export type TaxGroup = {
	code: string;
	description: string;
	taxes: Tax[];
};
