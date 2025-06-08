<!-- eslint-disable indent -->
<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Calendar Section -->
			<div class="order-1">
				<div class="bg-white rounded-lg border border-gray-200 p-4">
					<h2 class="text-lg font-semibold mb-4 text-gray-900">Calendar</h2>
					<VCalendar :attributes="dates" :columns="calendarColumns" @dayclick="onDateSelect" />
				</div>
			</div>

			<!-- Appointments List Section -->
			<div class="order-2">
				<div class="bg-white rounded-lg border border-gray-200 p-4">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
						<UIcon v-if="filteredAppointments.length > 0" :name="ICONS.RESET" size="24" @click="resetFilter" />
					</div>

					<!-- Loading state -->
					<ZLoading v-if="appointmentStore.loading" />

					<!-- Empty state -->
					<div v-else-if="displayedAppointments.length === 0" class="text-center py-8">
						<div class="text-gray-500">
							<h2 class="text-lg font-medium">No appointments found</h2>
							<p class="text-sm">
								{{ filteredAppointments.length > 0 ? 'No appointments for the selected date.' : 'Schedule your first appointment to get started.' }}
							</p>
						</div>
					</div>

					<!-- Appointments list -->
					<div v-else class="space-y-3 max-h-96 overflow-y-auto">
						<div v-for="appointment in displayedAppointments" :key="appointment.code" :class="['border rounded-lg p-4 transition-colors cursor-pointer']">
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
									<UBadge v-if="appointment.status === AppointmentStatus.CONFIRMED" color="green" variant="subtle">
										{{ appointment.status.toUpperCase() }}
									</UBadge>
									<UBadge v-else-if="appointment.status === AppointmentStatus.PENDING" color="yellow" variant="subtle">
										{{ appointment.status.toUpperCase() }}
									</UBadge>
									<UBadge v-else-if="appointment.status === AppointmentStatus.CANCELLED" color="red" variant="subtle">
										{{ appointment.status.toUpperCase() }}
									</UBadge>
									<UBadge v-else-if="appointment.status === AppointmentStatus.COMPLETED" color="blue" variant="subtle">
										{{ appointment.status.toUpperCase() }}
									</UBadge>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { AppointmentStatus, getFormattedDate, isSameDate } from 'wemotoo-common';
import type { Appointment } from '~/utils/types/appointment';

const links = [
	{
		label: 'Appointments',
		icon: ICONS.CALENDAR,
		to: '/',
	},
];

const appointmentStore = useAppointmentStore();
const { appointments } = storeToRefs(appointmentStore);
const filteredAppointments = ref<Appointment[]>([]);

// Responsive calendar columns
const calendarColumns = ref(1);

// Update columns based on screen size
onMounted(() => {
	const updateColumns = () => {
		calendarColumns.value = window.innerWidth >= 1024 ? 2 : 1;
	};

	updateColumns(); // Initial check
	window.addEventListener('resize', updateColumns);

	onUnmounted(() => {
		window.removeEventListener('resize', updateColumns);
	});
});

// Filter and sort upcoming appointments
const upcomingAppointments = computed(() => {
	const today = new Date();
	const apts = appointments.value
		.filter((appointment) => new Date(appointment.date_time) >= today)
		.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
		.slice(0, 10); // Show max 10 upcoming appointments

	return apts;
});

// Display appointments based on filter state
const displayedAppointments = computed(() => {
	return filteredAppointments.value.length > 0 ? filteredAppointments.value : upcomingAppointments.value;
});

const dates = computed(() => {
	return appointments.value.map((appointment) => ({
		key: appointment.code,
		dot: {
			color: 'green',
		},
		dates: appointment.date_time as any,
		popover: {
			label: `${appointment.customer_name} - ${appointment.customer_phone}`,
		},
		customData: appointment,
	}));
});

onMounted(async () => {
	await appointmentStore.getAppointments();
});

// Handle calendar date selection
const onDateSelect = (selectedDate: any) => {
	filteredAppointments.value = appointments.value.filter((appointment) => isSameDate(new Date(appointment.date_time), selectedDate.date));
};

// Reset filter to show all upcoming appointments
const resetFilter = () => {
	filteredAppointments.value = [];
};
</script>

<style></style>
