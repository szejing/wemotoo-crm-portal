import type { AppointmentStatus } from 'yeppi-common';

export type GetAppointmentsReq = {
	status?: AppointmentStatus;
	months?: number | number[];
};
