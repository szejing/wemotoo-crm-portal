import type { CreateShippingZoneReq } from './create-shipping-zone.req';

export type UpdateShippingZoneReq = Partial<
	Omit<CreateShippingZoneReq, 'merchant_id' | 'methods'>
> & {
	merchant_id: string;
	methods?: CreateShippingZoneReq['methods'];
};
