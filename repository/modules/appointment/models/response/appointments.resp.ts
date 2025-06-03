import type { Appointment } from '~/utils/types/appointment';

export type AppointmentsResp = {
	count: number;
	appointments: Appointment[];
};
