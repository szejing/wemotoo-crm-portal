import type { AppointmentStatus } from 'wemotoo-common';

export type AppointmentModel = {
	code: string;
	date_time: Date;
	item_line: number;
	cart_no?: string;
	order_no?: string;
	bill_no?: string;
	duration?: number;
	customer_name: string;
	customer_phone: string;
	ref_no?: string;
	status: AppointmentStatus;
};
