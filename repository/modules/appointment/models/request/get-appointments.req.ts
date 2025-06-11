import type { AppointmentStatus } from 'wemotoo-common';

export type GetAppointmentsReq = {
	status?: AppointmentStatus;
	months?: number | number[];
};
