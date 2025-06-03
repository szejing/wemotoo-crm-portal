export type UpdateAppointmentReq = {
	code: string;
	customer_id: number;
	service_id: number;
	staff_id: number;
	date: string;
	time: string;
	duration: number;
	price: number;
	payment_status: string;
};
