export type CreateShipmentReq = {
	merchant_id: string;
	order_no: string;
	inv_no: string;
	courier_name: string;
	tracking_no: string;
	shipping_method_id: number;
	user?: {
		id: string;
	};
};
