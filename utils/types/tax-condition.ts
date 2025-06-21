import type { TaxFilter } from './tax-filter';

export type TaxCondition = {
	code: string;
	starts_at: string;
	ends_at: string | null;
	amount_type: string;
	rate: number;
	min_amount: number | null;
	max_amount: number | null;
	filters: TaxFilter[];
};
