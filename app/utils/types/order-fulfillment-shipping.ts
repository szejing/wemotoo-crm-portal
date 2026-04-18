export type FulfillmentLifecycleStatusValue =
	| 'pending'
	| 'processing'
	| 'packed'
	| 'fulfilled';

export type ShipmentStatusValue =
	| 'pending'
	| 'shipped'
	| 'in_transit'
	| 'delivered'
	| 'failed';

export type ShippingZonePostcodePattern = {
	kind: 'exact' | 'prefix' | 'regex';
	value: string;
};

export type ShippingZoneRule = {
	name?: string;
	country_code: string;
	state?: string;
	postcode_patterns: ShippingZonePostcodePattern[];
	rule_priority?: number;
	is_default?: boolean;
	fee_override?: number | null;
	estimated_days_override?: number | null;
};

export type ShippingMethodZoneLink = {
	id: string;
	fee_override?: number | null;
	estimated_days_override?: number | null;
	shipping_zone?: {
		id: string;
		name?: string;
		country_code: string;
		state?: string;
		postcode_patterns: ShippingZonePostcodePattern[];
		rule_priority: number;
		is_default: boolean;
	};
};

export type ShippingMethodOption = {
	id: string;
	code?: string;
	name: string;
	fee: number;
	currency_code?: string;
	estimated_days?: number;
	priority?: number;
	/** @deprecated Prefer method_zones */
	zone?: Record<string, unknown>;
	method_zones?: ShippingMethodZoneLink[];
	is_active: boolean;
};

/** Editable fields for a merchant shipping zone (standalone CRUD). */
export type ShippingZoneMutableFields = {
	name: string;
	is_active: boolean;
	country_code: string;
	state?: string;
	postcode_patterns: ShippingZonePostcodePattern[];
	fee_override?: number | null;
	estimated_days_override?: number | null;
	/** Shipping methods that support delivery under this zone. */
	shipping_method_ids: string[];
};

/** Persisted shipping zone row. TODO(api): load/save via API instead of in-memory store. */
export type ShippingZoneRecord = ShippingZoneMutableFields & {
	id: string;
	created_at: string;
	updated_at: string;
};

export type OrderFulfillment = {
	id: string;
	order_no: string;
	inv_no: string;
	status: FulfillmentLifecycleStatusValue;
	packed_at?: string | Date | null;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type OrderShipment = {
	id: string;
	order_no: string;
	inv_no: string;
	courier_name: string;
	tracking_no: string;
	shipping_fee: number;
	status: ShipmentStatusValue;
	shipped_at?: string | Date | null;
	delivered_at?: string | Date | null;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type OrderActivity = {
	id?: number | string;
	action?: string;
	desc?: string;
	created_by?: string;
	user_id?: string;
	created_at: string | Date;
	metadata?: Record<string, unknown>;
};
