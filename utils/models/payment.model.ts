export type PaymentModel = {
	payment_line: number;
	payment_date_time: Date;
	payment_type_code: string;
	payment_type_desc: string;
	ref_no1: string;
	ref_no2: string;
	payment_amt: number;
	local_amt: number;
	currency_code: string;
	external_intg_type: number;
	metadata: Record<string, unknown>;
};
