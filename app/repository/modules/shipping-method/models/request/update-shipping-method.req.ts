import type { ShippingMethodUpdateBody } from './create-shipping-method.req';

export type UpdateShippingMethodReq = ShippingMethodUpdateBody & {
	merchant_id: string;
};
