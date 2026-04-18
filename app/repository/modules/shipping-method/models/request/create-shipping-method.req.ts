import type { ShippingZoneRule } from '~/utils/types/order-fulfillment-shipping';

export type CreateShippingMethodReq = {
	merchant_id: string;
	/** If omitted, the client may generate a unique code from the name. */
	code?: string;
	name: string;
	fee: number;
	estimated_days?: number;
	priority?: number;
	zone?: Record<string, unknown>;
	zones?: ShippingZoneRule[];
	is_active?: boolean;
};
