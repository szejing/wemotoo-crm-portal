// Input type for create/update operations
export type CustomerInput = {
	customer_no?: string;
	email_address: string;
	name: string;
	dial_code: string;
	phone_no: string;
};

// Reference type for selections
export type CustomerRef = {
	customer_no: string;
	name: string;
	email_address?: string;
};

// Model type for display/read operations
export type Customer = {
	customer_no: string;
	email_address: string;
	name: string;
	dial_code: string;
	phone_no: string;
	last_transaction: Date;
	total_spent: number;
	total_biils: number;
	created_at?: string;
	updated_at?: string;
};
