import { defineStore } from 'pinia';
import type { Appointment } from '~/utils/types/appointment';
import { failedNotification } from '../AppUi/AppUi';

export const useAppointmentStore = defineStore('appointmentStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		appointments: [] as Appointment[],
		errors: [] as string[],
	}),
	actions: {
		async getAppointments() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.appointment.fetchMany();

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
	},
});
