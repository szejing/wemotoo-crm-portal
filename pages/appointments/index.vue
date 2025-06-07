<!-- eslint-disable indent -->
<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Calendar Section -->
			<div class="order-1">
				<div class="bg-white rounded-lg border border-gray-200 p-4">
					<h2 class="text-lg font-semibold mb-4 text-gray-900">Calendar</h2>
					<VCalendar v-model="date" :attributes="dates" :columns="calendarColumns" @dayclick="onDateSelect" />
				</div>
			</div>

			<!-- Appointments List Section -->
			<div class="order-2">
				<div class="bg-white rounded-lg border border-gray-200 p-4">
					<h2 class="text-lg font-semibold mb-4 text-gray-900">Upcoming Appointments</h2>

					<!-- Loading state -->
					<ZLoading v-if="appointmentStore.loading" />

					<!-- Empty state -->
					<div v-else-if="upcomingAppointments.length === 0" class="text-center py-8">
						<div class="text-gray-500">
							<h2 class="text-lg font-medium">No upcoming appointments</h2>
							<p class="text-sm">Schedule your first appointment to get started.</p>
						</div>
					</div>

					<!-- Appointments list -->
					<div v-else class="space-y-3 max-h-96 overflow-y-auto">
						<div
							v-for="appointment in upcomingAppointments"
							:key="appointment.code"
							:class="[
								'border rounded-lg p-4 transition-colors cursor-pointer',
								isAppointmentSelected(appointment) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50',
							]"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<div class="w-3 h-3 rounded-full bg-green-500"></div>
										<h3 class="font-medium text-gray-900">
											{{ appointment.customer_name }}
										</h3>
									</div>

									<div class="space-y-1 text-sm text-gray-600">
										<div class="flex items-center gap-2">
											{{ appointment.customer_phone }}
										</div>

										<div class="flex items-center gap-2">
											{{ formatDate(appointment.date) }}
										</div>

										<div v-if="appointment.duration" class="flex items-center gap-2">
											<span class="text-gray-500">Duration:</span>
											{{ appointment.duration }} minutes
										</div>

										<div v-if="appointment.ref_no" class="flex items-center gap-2">
											<span class="text-gray-500">Ref:</span>
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
import { AppointmentStatus } from 'wemotoo-common';

const links = [
	{
		label: 'Appointments',
		icon: ICONS.CALENDAR,
		to: '/',
	},
];

const appointmentStore = useAppointmentStore();
const { appointments } = storeToRefs(appointmentStore);

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
	const now = new Date();
	return appointments.value
		.filter((appointment) => new Date(appointment.date) >= now)
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 10); // Show max 10 upcoming appointments
});

// Check if appointment is on selected date
const isAppointmentSelected = (appointment: any) => {
	console.log(appointment);
	if (!date.value) return false;

	const appointmentDate = new Date(appointment.date);
	let selectedDate = date.value;

	// Handle if selectedDate is already a Date object or needs conversion
	if (!(selectedDate instanceof Date)) {
		selectedDate = new Date(selectedDate);
	}

	// Compare year, month, and day only
	const appointmentDateString = appointmentDate.toISOString().split('T')[0];
	const selectedDateString = selectedDate.toISOString().split('T')[0];

	return appointmentDateString === selectedDateString;
};

// Format date for display
const formatDate = (dateString: string | Date) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const dates = computed(() => {
	return appointments.value.map((appointment) => ({
		key: appointment.code,
		dot: {
			color: 'green',
		},
		dates: new Date(appointment.date) as any,
		popover: {
			label: `${appointment.customer_name} - ${appointment.customer_phone}`,
		},
		customData: appointment,
	}));
});

onMounted(async () => {
	await appointmentStore.getAppointments();
});

const date = ref(new Date());

// Debug date changes
watch(
	date,
	(newDate) => {
		console.log('Date selected:', newDate, typeof newDate);
	},
	{ immediate: true },
);

// Handle calendar date selection
const onDateSelect = (selectedDate: Date) => {
	date.value = selectedDate;
};
</script>

<style></style>
