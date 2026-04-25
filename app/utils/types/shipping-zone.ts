import type { ShippingZonePostcodePattern } from './order-fulfillment-shipping';

/** Mirrors `ShippingMethodBriefDto` in ecommerce-nestjs shipping-zone response DTO. */
export type ShippingMethodBrief = {
	id: string;
	code: string;
	description: string;
};

/** Mirrors `ShippingMethodZoneWithMethodDto` in ecommerce-nestjs shipping-zone response DTO. */
export type ShippingMethodZoneWithMethod = {
	id: string;
	fee: number;
	estimated_days?: number;
	shipping_method?: ShippingMethodBrief;
};

/** Mirrors `ShippingZoneWithLinksDto` in ecommerce-nestjs shipping-zone response DTO. */
export type ShippingZone = {
	id: string;
	code: string;
	description?: string;
	country_code: string;
	state?: string;
	postcode_patterns: ShippingZonePostcodePattern[];
	rule: number;
	is_default: boolean;
	is_active: boolean;
	methods?: ShippingMethodZoneWithMethod[];
};

/** Mirrors `GetShippingZoneResponseDto` in ecommerce-nestjs shipping-zone response DTO. */
export type GetShippingZoneResponse = {
	shipping_zone: ShippingZone;
};

/** Mirrors `GetShippingZonesResponseDto` in ecommerce-nestjs shipping-zone response DTO. */
export type GetShippingZonesResponse = {
	shipping_zones: ShippingZone[];
	total: number;
};
