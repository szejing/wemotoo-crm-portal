import type { CustomerInsight } from 'yeppi-common';

export type { CustomerInsight };

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
	insights?: CustomerInsight[];
};
