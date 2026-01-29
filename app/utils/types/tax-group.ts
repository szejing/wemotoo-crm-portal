import type { Tax } from './tax';

// Input type for create/update operations
export type TaxGroupInput = {
	code: string;
	description?: string;
	tax_codes?: string[];
};

// Reference type for selections
export type TaxGroupRef = {
	code: string;
	description?: string;
};

// Model type for display/read operations
export type TaxGroup = {
	code: string;
	description: string;
	taxes: Tax[];
	created_at?: string;
	updated_at?: string;
};
