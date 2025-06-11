import { defineStore } from 'pinia';
import type { Appointment } from '~/utils/types/appointment';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { AppointmentStatus } from 'wemotoo-common';

export const useAppointmentStore = defineStore('appointmentStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		appointments: [] as Appointment[],
		errors: [] as string[],
	}),
	actions: {
		async getAppointments(status?: AppointmentStatus, months?: number | number[]) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.appointment.fetchMany({ status, months });

				if (data.appointments) {
					this.appointments = data.appointments;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async updateAppointment(code: string, date_time: string, ref_no: string, status: string) {
			this.updating = true;
			const { $api } = useNuxtApp();
			try {
				const updated = await $api.appointment.update(code, { date_time, ref_no, status });

				if (updated.appointment) {
					this.appointments = this.appointments.map((appointment) => (appointment.code === code ? updated.appointment : appointment));
				}
				successNotification('Appointment updated successfully');
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteAppointment(code: string) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				await $api.appointment.delete(code);
				successNotification('Appointment deleted successfully');
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
