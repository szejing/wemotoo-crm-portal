import { options_page_size } from '~/utils/options';
import { defineStore } from 'pinia';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import { AppointmentStatus, getFormattedDate } from 'wemotoo-common';
import type { Range } from '~/utils/interface';
import { add, sub } from 'date-fns';
import type { Appointment } from '~/utils/types/appointment';

type AppointmentFilter = {
	query: string;
	status: AppointmentStatus | string;
	date_range: Range;
	page_size: number;
	current_page: number;
};

const initialEmptyAppointmentFilter: AppointmentFilter = {
	query: '',
	status: 'All',
	date_range: {
		start: sub(new Date(), { days: 14 }),
		end: add(new Date(), { days: 14 }),
	},
	page_size: options_page_size[0] as number,
	current_page: 1,
};

export const useAppointmentStore = defineStore('appointmentStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		appointments: [] as Appointment[],
		errors: [] as string[],
		filter: initialEmptyAppointmentFilter,
	}),
	actions: {
		async getAppointments() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				let filter = '';

				// For 'All' status, don't add any status filter - let all statuses through
				if (this.filter.status === 'pending') {
					filter = `status in ('${AppointmentStatus.PENDING}')`;
				} else if (this.filter.status === 'confirmed') {
					filter = `status eq '${AppointmentStatus.CONFIRMED}'`;
				} else if (this.filter.status === 'completed') {
					filter = `status eq '${AppointmentStatus.COMPLETED}'`;
				} else if (this.filter.status === 'cancelled') {
					filter = `status in ('${AppointmentStatus.CANCELLED}', '${AppointmentStatus.VOIDED}')`;
				}

				let { start, end } = this.filter.date_range;

				start = start ?? new Date();
				end = end ?? new Date();

				// Add date filter
				const dateFilter = end
					? `(date_time between '${getFormattedDate(start, 'yyyy-MM-dd')}' and '${getFormattedDate(end, 'yyyy-MM-dd')}')`
					: `date_time le '${getFormattedDate(start, 'yyyy-MM-dd')}'`;

				filter = filter ? `${filter} and ${dateFilter}` : dateFilter;

				// Add query filter if provided
				if (this.filter.query) {
					const queryFilter = `order_no contains '${this.filter.query}'`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const { data, '@odata.count': total } = await $api.appointment.getMany({
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$count: true,
					$filter: filter,
					// $expand: removeDuplicateExpands(defaultOrderRelations).join(','),
					$orderby: 'date_time desc',
				});

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
