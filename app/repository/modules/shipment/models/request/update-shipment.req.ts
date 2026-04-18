import type { CreateShipmentReq } from './create-shipment.req';

export type UpdateShipmentReq = Partial<
	Omit<CreateShipmentReq, 'merchant_id' | 'order_no' | 'inv_no'>
> & {
	merchant_id: string;
};
