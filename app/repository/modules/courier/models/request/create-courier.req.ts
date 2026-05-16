export type CreateCourierReq = {
	merchant_id: string;
	name: string;
	description?: string | null;
	is_active?: boolean;
};

export type CourierWriteBody = Omit<CreateCourierReq, 'merchant_id'>;
