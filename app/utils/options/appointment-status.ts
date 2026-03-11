import { AppointmentStatus } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export const options_appointment_status = [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED];

export function getAppointmentStatusOptions(t: TranslateFn) {
	return [
		{ value: AppointmentStatus.PENDING, label: t('options.pending') },
		{ value: AppointmentStatus.CONFIRMED, label: t('options.confirmed') },
		{ value: AppointmentStatus.CANCELLED, label: t('options.cancelled') },
		{ value: AppointmentStatus.COMPLETED, label: t('options.completed') },
	];
}

// Helper to get status badge color
export const getAppointmentStatusColor = (status: AppointmentStatus): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
	const colorMap: Record<string, string> = {
		[AppointmentStatus.PENDING]: 'warning',
		[AppointmentStatus.CONFIRMED]: 'info',
		[AppointmentStatus.COMPLETED]: 'success',
		[AppointmentStatus.CANCELLED]: 'error',
	};
	return colorMap[status] as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
};
