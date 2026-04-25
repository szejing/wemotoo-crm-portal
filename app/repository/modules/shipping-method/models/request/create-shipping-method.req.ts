export type CreateShippingMethodReq = {
	merchant_id: string;
	description: string;
	priority?: number;
	is_active?: boolean;
};

/** API body without merchant context — the store injects `merchant_id`. */
export type ShippingMethodWriteBody = Omit<CreateShippingMethodReq, 'merchant_id'>;

export type ShippingMethodUpdateBody = Partial<ShippingMethodWriteBody>;
