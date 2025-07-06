<!-- eslint-disable indent -->
<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Calendar Section -->
			<div class="order-1 shadow-md">
				<div class="bg-white rounded-lg border border-gray-200 p-4">
					<h2 class="text-lg font-semibold mb-4 text-gray-900">Calendar</h2>
					<VCalendar :attributes="dates" :columns="calendarColumns" @dayclick="onDateSelect" />
				</div>
			</div>

			<!-- Appointments List Section -->
			<div class="order-2">
				<div class="bg-white rounded-lg border border-gray-200 p-4 shadow-md">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
						<UIcon v-if="filteredAppointments.length > 0" :name="ICONS.RESET" size="24" class="cursor-pointer" @click="resetFilter" />
					</div>

					<!-- Loading state -->
					<ZLoading v-if="appointmentStore.loading" />

					<!-- Empty state -->
					<div v-else-if="displayedAppointments.length == 0" class="text-center py-8">
						<div class="text-gray-500">
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
import { ZModalAppointmentDetail, ZModalConfirmation } from '#components';
import { AppointmentStatus, getFormattedDate, isFuture, isSameDate } from 'wemotoo-common';
import type { Appointment } from '~/utils/types/appointment';

const links = [
	{
		label: 'Appointments',
		icon: ICONS.CALENDAR,
		to: '/',
	},
];

const modal = useModal();
const appointmentStore = useAppointmentStore();
const { appointments } = storeToRefs(appointmentStore);
const filteredAppointments = ref<Appointment[]>([]);

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

// Responsive calendar columns
const calendarColumns = ref(1);
const today = new Date();

// Update columns based on screen size
onMounted(async () => {
	const updateColumns = () => {
		calendarColumns.value = window.innerWidth >= 1024 ? 2 : 1;
	};

	updateColumns(); // Initial check
	window.addEventListener('resize', updateColumns);

	const months = calendarColumns.value > 2 ? [today.getMonth() + 1, today.getMonth() + 2] : today.getMonth() + 1;

	await appointmentStore.getAppointments(AppointmentStatus.CONFIRMED, months);
});

// Display appointments based on filter state
const displayedAppointments = computed(() => {
	if (filteredAppointments.value.length > 0) {
		return filteredAppointments.value;
	}

	return appointments.value
		.filter((appointment) => isFuture(new Date(appointment.date_time)))
		.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
		.slice(0, 10);
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

// Handle calendar date selection
const onDateSelect = (selectedDate: any) => {
	filteredAppointments.value = appointments.value.filter((appointment) => isSameDate(new Date(appointment.date_time), selectedDate.date));
};

// Reset filter to show all upcoming appointments
const resetFilter = () => {
	filteredAppointments.value = [];
};

const deleteAppointment = async (code: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this appointment?',
		action: 'delete',
		onConfirm: async () => {
			await appointmentStore.deleteAppointment(code);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectAppointment = async (appointment: Appointment) => {
	if (!appointment) return;

	modal.open(ZModalAppointmentDetail, {
		appointment: JSON.parse(JSON.stringify(appointment)),
		onUpdate: async ({ date_time, ref_no, status }) => {
			await appointmentStore.updateAppointment(appointment.code, date_time, ref_no, status);
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteAppointment(appointment.code);
		},
		onCancel: () => {
			modal.close();
		},
	});
};
</script>

<style></style>
