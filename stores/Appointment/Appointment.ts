import { defineStore } from 'pinia';
import type { Appointment } from '~/utils/types/appointment';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import { AppointmentStatus } from 'wemotoo-common';

export const useAppointmentStore = defineStore('appointmentStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		appointments: [] as Appointment[],
		errors: [] as string[],
	}),
	actions: {
		async getAppointments(months?: number | number[]) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				// eq = equal, ne = not equal
				// exclude completed
				let filter = `status ne '${AppointmentStatus.COMPLETED}'`;

				// Add status filter if provided

				// Handle months filter
				if (months !== undefined) {
					const monthsArray = Array.isArray(months) ? months : [months];
					const currentYear = new Date().getFullYear();

					// Create date range filters for each month
					const dateFilters = monthsArray.map((month) => {
						const startDate = new Date(currentYear, month - 1, 1); // month - 1 because months are 0-indexed
						const endDate = new Date(currentYear, month, 0, 23, 59, 59, 999); // Last day of the month

						const startDateStr = startDate.toISOString();
						const endDateStr = endDate.toISOString();

						return `date_time between '${startDateStr}' and '${endDateStr}'`;
					});

					const monthFilter = dateFilters.join(' or ');

					if (filter) {
						filter += ` and (${monthFilter})`;
					} else {
						filter = monthFilter;
					}
				}

				const { data } = await $api.appointment.getMany({ $filter: filter });

				if (data) {
					this.appointments = data;
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
