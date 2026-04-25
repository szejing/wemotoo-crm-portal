import type { CreateShippingZoneReq, ShippingZoneWriteBody } from './create-shipping-zone.req';

export type UpdateShippingZoneReq = Partial<Omit<ShippingZoneWriteBody, 'methods'>> & {
	merchant_id: string;
	methods?: CreateShippingZoneReq['methods'];
};

/** Partial update from forms; `shipping_method_ids` is UI-only and stripped before HTTP. */
export type ShippingZoneUpdateStorePayload = Partial<ShippingZoneWriteBody> & {
	shipping_method_ids?: string[];
};
