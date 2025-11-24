import { AppointmentStatus } from 'wemotoo-common';

export const options_appointment_status = [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED];

export const getAppointmentStatusColor = (status: AppointmentStatus): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' => {
	const color: Record<AppointmentStatus, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral'> = {
		[AppointmentStatus.PENDING]: 'info',
		[AppointmentStatus.CONFIRMED]: 'success',
		[AppointmentStatus.CANCELLED]: 'error',
		[AppointmentStatus.COMPLETED]: 'success',
		[AppointmentStatus.VOIDED]: 'error',
		[AppointmentStatus.RESCHEDULED]: 'warning',
		[AppointmentStatus.NO_SHOW]: 'neutral',
	};
	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral';
};
