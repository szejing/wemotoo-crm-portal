import type { CourierWriteBody } from './create-courier.req';

export type UpdateCourierReq = Partial<CourierWriteBody> & {
	merchant_id: string;
};
