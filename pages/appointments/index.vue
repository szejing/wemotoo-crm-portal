<!-- eslint-disable indent -->
<template>
	<UDashboardPanel id="appointments">
		<template #header>
			<UDashboardNavbar title="Appointments" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar class="sm:hidden">
				<template #left>
					<ZSelectMenuDateRange v-model="selectedDateRange" class="-ms-1" @update:model-value="updateRange" />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
				<!-- Calendar Section -->
				<div class="order-1 hidden sm:block shadow-md bg-white rounded-lg border border-neutral-200 p-4">
					<UCalendar v-model="calendarRange" range>
						<template #day="{ day }">
							<div class="relative w-full h-full flex items-center justify-center">
								<span>{{ day.day }}</span>
								<div v-if="hasAppointments(day)" class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
							</div>
						</template>
					</UCalendar>
				</div>

				<!-- Appointments List Section -->
				<div class="order-2 sm:col-span-3 row-span-2">
					<div class="bg-white rounded-lg border border-neutral-200 p-4 shadow-md">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-lg font-semibold text-neutral-900">Upcoming Appointments</h2>
							<UIcon v-if="filteredAppointments.length > 0" :name="ICONS.RESET" size="24" class="cursor-pointer" @click="resetFilter" />
						</div>

						<!-- Loading state -->
						<ZLoading v-if="appointmentStore.loading" />

						<!-- Empty state -->
						<div v-else-if="displayedAppointments.length == 0" class="text-center py-8">
							<div class="text-neutral-500">
								<h2 class="text-lg font-medium">No appointments found</h2>
								<p class="text-sm">
									{{ filteredAppointments.length > 0 ? 'No appointments for the selected date.' : 'Schedule your first appointment to get started.' }}
								</p>
							</div>
						</div>

						<!-- Appointments list -->
						<div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:max-h-[calc(100vh-220px)] overflow-y-auto">
							<UButton
								v-for="appointment in displayedAppointments"
								:key="appointment.code"
								color="neutral"
								variant="outline"
								class="p-4"
								@click="selectAppointment(appointment)"
							>
								<div class="flex items-start">
									<div>
										<h3 class="text-lg font-semibold text-secondary-900">
											{{ appointment.order_no }}
										</h3>
										<div class="flex items-center gap-2 mb-2">
											<div class="w-3 h-3 rounded-full bg-green-500"></div>
											<h3 class="font-medium text-secondary-900">
												{{ appointment.customer_name }}
											</h3>
										</div>

										<div class="space-y-1 text-sm text-secondary-600">
											<div class="flex items-center gap-2">
												{{ appointment.customer_phone }}
											</div>

											<div class="flex items-center gap-2">
												{{ getFormattedDate(appointment.date_time, 'dd MMM yyyy HH:mm') }}
											</div>

											<div v-if="appointment.duration" class="flex items-center gap-2">
												<span class="text-neutral-400">Duration:</span>
												{{ appointment.duration }} minutes
											</div>

											<div v-if="appointment.ref_no" class="flex items-center gap-2">
												<span class="text-neutral-400">Ref:</span>
												{{ appointment.ref_no }}
											</div>
										</div>
									</div>

									<div class="ml-4">
										<UBadge v-if="appointment.status === AppointmentStatus.CONFIRMED" color="success" variant="subtle">
											{{ appointment.status.toUpperCase() }}
										</UBadge>
										<UBadge v-else-if="appointment.status === AppointmentStatus.PENDING" color="warning" variant="subtle">
											{{ appointment.status.toUpperCase() }}
										</UBadge>
										<UBadge v-else-if="appointment.status === AppointmentStatus.CANCELLED" color="error" variant="subtle">
											{{ appointment.status.toUpperCase() }}
										</UBadge>
										<UBadge v-else-if="appointment.status === AppointmentStatus.COMPLETED" color="info" variant="subtle">
											{{ appointment.status.toUpperCase() }}
										</UBadge>
									</div>
								</div>
							</UButton>
						</div>
					</div>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalAppointmentDetail, ZModalConfirmation } from '#components';
import { AppointmentStatus, getFormattedDate, isFuture, isSameDate } from 'wemotoo-common';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import type { Appointment } from '~/utils/types/appointment';
import type { Range } from '~/utils/interface';
import type { DateValue } from '@internationalized/date';

const today = new Date();
const overlay = useOverlay();
const appointmentStore = useAppointmentStore();
const { appointments } = storeToRefs(appointmentStore);
const filteredAppointments = ref<Appointment[]>([]);
const selectedMonth = ref(today.getMonth() + 1);
const selectedYear = ref(today.getFullYear());
const selectedDateRange = ref<Range>({});

useHead({ title: 'Appointments' });

// Helper function to convert Date to CalendarDate
const toCalendarDate = (date: Date) => {
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

// Computed property to convert Range to CalendarDate format for UCalendar
const calendarRange = computed({
	get: () => ({
		start: selectedDateRange.value.start ? toCalendarDate(selectedDateRange.value.start) : undefined,
		end: selectedDateRange.value.end ? toCalendarDate(selectedDateRange.value.end) : undefined,
	}),
	set: (newValue: { start: CalendarDate | null; end: CalendarDate | null }) => {
		const startDate = newValue.start ? newValue.start.toDate(getLocalTimeZone()) : undefined;
		const endDate = newValue.end ? newValue.end.toDate(getLocalTimeZone()) : undefined;

		// Set start time to 00:00:00
		if (startDate) {
			startDate.setHours(0, 0, 0, 0);
		}

		// Set end time to 23:59:59
		if (endDate) {
			endDate.setHours(23, 59, 59, 999);
		}

		selectedDateRange.value = {
			start: startDate,
			end: endDate,
		};
	},
});

onMounted(async () => {
	await appointmentStore.getAppointments(selectedMonth.value);
});

// Display appointments based on filter state
const displayedAppointments = computed(() => {
	if (filteredAppointments.value.length > 0) {
		return filteredAppointments.value;
	}

	return appointments.value
		.filter(
			(appointment) =>
				new Date(appointment.date_time).getMonth() == selectedMonth.value - 1 &&
				new Date(appointment.date_time).getFullYear() == selectedYear.value &&
				isFuture(new Date(appointment.date_time)),
		)
		.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
		.slice(0, 10);
});

// Get appointments for a specific date
const getAppointmentsForDate = (date: Date) => {
	return appointments.value.filter((appointment) => isSameDate(new Date(appointment.date_time), date));
};

// Check if a date has appointments
const hasAppointments = (date: DateValue) => {
	const jsDate = new Date(date.year, date.month - 1, date.day);
	return getAppointmentsForDate(jsDate).length > 0;
};

// Watch for date range selection changes (ZSelectMenuDateRange)
watch(
	selectedDateRange,
	async (newRange) => {
		if (newRange.start && newRange.end) {
			filteredAppointments.value = appointments.value.filter((appointment) => {
				const appointmentDate = new Date(appointment.date_time);
				return appointmentDate >= newRange.start! && appointmentDate <= newRange.end!;
			});

			// Update month/year based on start date
			const startMonth = newRange.start.getMonth() + 1;
			const startYear = newRange.start.getFullYear();
			if (startMonth !== selectedMonth.value || startYear !== selectedYear.value) {
				selectedMonth.value = startMonth;
				selectedYear.value = startYear;
				await appointmentStore.getAppointments(selectedMonth.value);
			}
		}
	},
	{ deep: true },
);

// Reset filter to show all upcoming appointments
const resetFilter = () => {
	filteredAppointments.value = [];
	selectedDateRange.value = {};
};

const deleteAppointment = async (code: string) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this appointment?',
			action: 'delete',
			onConfirm: async () => {
				await appointmentStore.deleteAppointment(code);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectAppointment = async (appointment: Appointment) => {
	if (!appointment) return;

	const appointmentModal = overlay.create(ZModalAppointmentDetail, {
		props: {
			appointment: JSON.parse(JSON.stringify(appointment)),
			onUpdate: async (data: { date_time: string; ref_no: string; status: AppointmentStatus }) => {
				const { date_time, ref_no, status } = data;
				await appointmentStore.updateAppointment(appointment.code, date_time, ref_no, status);
				appointmentModal.close();
			},
			onDelete: async () => {
				appointmentModal.close();
				await deleteAppointment(appointment.code);
			},
			onCancel: () => {
				appointmentModal.close();
			},
		},
	});

	appointmentModal.open();
};

const updateRange = async (newValue: Range) => {
	selectedDateRange.value = newValue;
	await appointmentStore.getAppointments(selectedMonth.value);
};
</script>

<style scoped></style>
