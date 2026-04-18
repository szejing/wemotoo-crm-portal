import type { CreateShippingMethodReq } from './create-shipping-method.req';

export type UpdateShippingMethodReq = Partial<
	Omit<CreateShippingMethodReq, 'merchant_id'>
> & {
	merchant_id: string;
};
