export type AddressModel = {
	address1: string;
	address2?: string;
	address3?: string;
	city: string;
	postal_code: string;
	state: string;
	country_code: string;
};

export type CustomerModel = {
	name: string;
	customer_no: string;
	email_address: string;
	dial_code: string;
	phone_no: string;
	ic_no?: string;
	date_of_birth?: Date;
	ref_no1?: string;
	ref_no2?: string;
	shipping_address: AddressModel;
	billing_address: AddressModel;
};
