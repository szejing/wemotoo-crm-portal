import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';

export type ResolvedShippingMethodRow = {
	matched_tier: string;
	match_score: number;
	effective_fee: number;
	effective_estimated_days?: number;
	shipping_method: ShippingMethodOption;
};

export type ResolveShippingMethodsResp = {
	resolved: ResolvedShippingMethodRow[];
};
