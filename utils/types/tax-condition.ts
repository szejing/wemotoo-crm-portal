import type { TaxFilter } from './tax-filter';

export type TaxCondition = {
	id: number;
	tax_code: string;
	starts_at?: Date;
	ends_at?: Date | undefined;
	amount_type: string;
	rate: number;
	min_amount: number | null;
	max_amount: number | null;
	filters: TaxFilter[];
};
