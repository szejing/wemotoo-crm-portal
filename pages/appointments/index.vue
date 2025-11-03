<!-- eslint-disable indent -->
<template>
	<UDashboardPanel id="appointments">
		<template #header>
			<UDashboardNavbar title="Appointments" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="grid grid-cols-4 gap-4">
				<!-- Calendar Section -->
				<div class="order-1 shadow-md bg-white rounded-lg border border-neutral-200 p-4">
					<UCalendar v-model="selectedDate">
						<template #day="{ day }">
							<div class="relative w-full h-full flex items-center justify-center">
								<span>{{ day.day }}</span>
								<div v-if="hasAppointments(day)" class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
							</div>
						</template>
					</UCalendar>
				</div>

				<!-- Appointments List Section -->
				<div class="order-2 col-span-3 row-span-2">
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
						<div v-else class="space-y-3 md:max-h-[calc(100vh-220px)] overflow-y-auto">
							<div
								v-for="appointment in displayedAppointments"
								:key="appointment.code"
								:class="['border rounded-lg p-4 transition-colors cursor-pointer']"
								@click="selectAppointment(appointment)"
							>
								<div class="flex items-start justify-between">
									<div class="flex-1">
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
												{{ getFormattedDate(appointment.date_time, 'dd/MM/yyyy HH:mm') }}
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
							</div>
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
import type { Appointment } from '~/utils/types/appointment';
import type { DateValue } from '@internationalized/date';

const today = new Date();
const overlay = useOverlay();
const appointmentStore = useAppointmentStore();
const { appointments } = storeToRefs(appointmentStore);
const filteredAppointments = ref<Appointment[]>([]);
const selectedMonth = ref(today.getMonth() + 1);
const selectedYear = ref(today.getFullYear());
const selectedDate = ref<DateValue>();

useHead({ title: 'Appointments' });

// Responsive calendar columns

// Update columns based on screen size
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

// Watch for date selection changes
watch(selectedDate, (newDate) => {
	if (newDate) {
		const jsDate = new Date(newDate.year, newDate.month - 1, newDate.day);
		filteredAppointments.value = appointments.value.filter((appointment) => isSameDate(new Date(appointment.date_time), jsDate));

		// Check if month/year changed
		if (newDate.month !== selectedMonth.value || newDate.year !== selectedYear.value) {
			selectedMonth.value = newDate.month;
			selectedYear.value = newDate.year;
			appointmentStore.getAppointments(selectedMonth.value);
		}
	}
});

// Reset filter to show all upcoming appointments
const resetFilter = () => {
	filteredAppointments.value = [];
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
</script>

<style scoped></style>
