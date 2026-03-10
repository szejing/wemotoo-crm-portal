import type { AppointmentStatus } from 'wemotoo-common';

export type UpdateAppointmentReq = {
	order_no: string;
	start_date_time: Date;
	end_date_time?: Date;
	ref_no?: string | undefined;
	status?: AppointmentStatus;
};
