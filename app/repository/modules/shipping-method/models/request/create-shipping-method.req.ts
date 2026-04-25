import type { ShippingZoneRule } from '~/utils/types/order-fulfillment-shipping';

export type CreateShippingMethodReq = {
	merchant_id: string;
	/** If omitted, the client may generate a unique code from the description. */
	code?: string;
	description: string;
	priority?: number;
	is_active?: boolean;
};
