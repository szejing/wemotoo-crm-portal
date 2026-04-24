export type CreateShippingZoneReq = {
	merchant_id: string;
	code: string;
	description?: string | null;
	is_active?: boolean;
	country_code: string;
	state?: string | null;
	postcode_patterns?: { kind: 'exact' | 'prefix' | 'regex'; value: string }[];
	rule?: number;
	is_default?: boolean;
	methods: { shipping_method_id: string; fee: number; estimated_days?: number | null }[];
};
