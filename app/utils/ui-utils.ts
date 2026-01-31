import { AppointmentStatus } from 'wemotoo-common';

// Helper to get status badge color
export const getAppointmentStatusColor = (status: AppointmentStatus): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
	const colorMap: Record<string, string> = {
		[AppointmentStatus.PENDING]: 'warning',
		[AppointmentStatus.CONFIRMED]: 'success',
		[AppointmentStatus.COMPLETED]: 'info',
		[AppointmentStatus.CANCELLED]: 'error',
	};
	return colorMap[status] as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
};
