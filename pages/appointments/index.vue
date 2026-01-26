<!-- eslint-disable indent -->
<template>
	<UDashboardPanel id="appointments">
		<template #header>
			<UDashboardNavbar title="Appointments" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterAppointments />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<div class="flex flex-col sm:flex-row sm:items-center justify-end sm:justify-between gap-4">
					<!-- Status Filter Tabs -->
					<div class="hidden sm:flex gap-2 overflow-x-auto">
						<UButton
							v-for="(tab, index) in appointmentTabs"
							:key="tab.value"
							:variant="selectedTab === index ? 'solid' : 'soft'"
							:color="selectedTab === index ? 'primary' : 'neutral'"
							size="sm"
							@click="selectTab(index)"
						>
							{{ capitalizeFirstLetter(tab.label) }}
						</UButton>
					</div>

					<!-- Table Actions -->
					<div class="flex items-center gap-3 justify-end">
						<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportAppointments">
							<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
							Export
						</UButton>
					</div>
				</div>

				<!-- Main Content Grid -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Appointments List -->
					<div :class="selectedAppointment ? 'lg:col-span-1' : 'lg:col-span-3'">
						<UCard>
							<div class="flex items-center justify-between mb-4">
								<div>
									<h3 class="font-semibold">
										{{ filteredAppointments.length > 0 ? 'Filtered Appointments' : 'Upcoming Appointments' }}
									</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
										{{ displayedAppointments.length }} appointment{{ displayedAppointments.length !== 1 ? 's' : '' }}
									</p>
								</div>
							</div>

							<!-- Loading state -->
							<ZLoading v-if="appointmentStore.loading" />

							<!-- Empty state -->
							<div v-else-if="displayedAppointments.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
								<UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-gray-400" />
								<div class="text-center">
									<p class="font-medium text-gray-900 dark:text-white">No appointments found</p>
									<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
										{{ filteredAppointments.length > 0 || filter.query ? 'Try adjusting your filters' : 'Schedule your first appointment to get started' }}
									</p>
								</div>
							</div>

							<!-- Appointments List -->
							<div v-else class="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto pr-2">
								<UCard
									v-for="appointment in displayedAppointments"
									:key="appointment.code"
									:class="[
										'hover:shadow-md transition-shadow cursor-pointer border',
										selectedAppointment?.code === appointment.code
											? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
											: 'border-gray-200 dark:border-gray-700',
									]"
									@click="selectAppointment(appointment)"
								>
									<div class="space-y-3">
										<!-- Header: Order No & Status -->
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
												<span class="text-lg font-bold text-gray-900 dark:text-white"> {{ appointment.order_no }} </span>
											</div>
											<UBadge :color="getStatusColor(appointment.status)" variant="subtle" size="sm">
												{{ appointment.status.toUpperCase() }}
											</UBadge>
										</div>

										<!-- Date & Time (Prominent) -->
										<div class="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-lg">
											<div class="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
												<UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
											</div>
											<div class="flex-1">
												<p class="text-sm text-gray-600 dark:text-gray-400">Appointment Date</p>
												<p class="font-semibold text-gray-900 dark:text-white">
													{{ formatAppointmentDateRange(appointment.start_date_time, appointment.end_date_time) }}
												</p>
											</div>
										</div>

										<!-- Service Description (Required) -->
										<div class="flex items-start gap-3">
											<div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
												<UIcon name="i-heroicons-wrench" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
											</div>
											<div class="flex-1 min-w-0">
												<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Service</p>
												<p class="font-medium text-gray-900 dark:text-white">{{ appointment.appt_desc || 'No description' }}</p>
											</div>
										</div>

										<!-- Customer Info (Required) -->
										<div class="flex items-start gap-3">
											<div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
												<UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
											</div>
											<div class="flex-1 min-w-0">
												<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Customer</p>
												<p class="font-medium text-gray-900 dark:text-white truncate">{{ appointment.customer_name }}</p>
												<p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ appointment.customer_phone }}</p>
											</div>
										</div>

										<!-- Optional: Duration -->
										<div v-if="appointment.duration" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pl-1">
											<UIcon name="i-heroicons-clock" class="w-4 h-4" />
											<span>Duration: {{ appointment.duration }} minutes</span>
										</div>
									</div>
								</UCard>
							</div>
						</UCard>
					</div>

					<!-- Appointment Detail -->
					<div v-if="selectedAppointment" class="lg:col-span-2">
						<UCard>
							<div class="flex items-center justify-between mb-6">
								<div class="flex items-center gap-3">
									<UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
									<div>
										<h3 class="font-bold text-xl text-gray-900 dark:text-white">{{ selectedAppointment.order_no }}</h3>
										<p class="text-sm text-gray-500 dark:text-gray-400">Appointment Details</p>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<UBadge :color="getStatusColor(selectedAppointment.status)" variant="subtle" size="md">
										{{ selectedAppointment.status.toUpperCase() }}
									</UBadge>
									<UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="selectedAppointment = null" />
								</div>
							</div>

							<div class="space-y-6">
								<!-- Date & Time (Priority) -->
								<div class="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-200 dark:border-primary-800">
									<div class="flex items-center gap-4">
										<div class="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
											<UIcon name="i-heroicons-calendar-days" class="w-7 h-7 text-primary-600 dark:text-primary-400" />
										</div>
										<div class="flex-1">
											<p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Appointment Date & Time</p>
											<p class="text-lg font-bold text-gray-900 dark:text-white">
												{{ formatAppointmentDateRange(selectedAppointment.start_date_time, selectedAppointment.end_date_time) }}
											</p>
											<p v-if="selectedAppointment.duration" class="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
												<UIcon name="i-heroicons-clock" class="w-4 h-4" />
												Duration: {{ selectedAppointment.duration }} minutes
											</p>
										</div>
									</div>
								</div>

								<!-- Service Description (Required) -->
								<div>
									<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Service Details</h4>
									<div :class="['flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg', selectedAppointment.ref_no ? 'items-start' : 'items-center']">
										<div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
											<UIcon name="i-heroicons-wrench" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
										</div>
										<div class="flex-1">
											<p class="font-semibold text-gray-900 dark:text-white mb-1">{{ selectedAppointment.appt_desc || 'No description' }}</p>
											<p v-if="selectedAppointment.ref_no" class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
												<UIcon name="i-heroicons-hashtag" class="w-4 h-4" />
												Reference: {{ selectedAppointment.ref_no }}
											</p>
										</div>
									</div>
								</div>

								<!-- Customer Information (Required) -->
								<div>
									<h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Customer Information</h4>
									<div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
										<div class="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
											<UIcon name="i-heroicons-user" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
										</div>
										<div class="flex-1">
											<p class="font-semibold text-gray-900 dark:text-white">{{ selectedAppointment.customer_name }}</p>
											<p class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
												<UIcon name="i-heroicons-phone" class="w-4 h-4" />
												{{ selectedAppointment.customer_phone }}
											</p>
										</div>
									</div>
								</div>

								<!-- Actions -->
								<div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
									<UButton color="primary" variant="solid" @click="openEditModal(selectedAppointment)">
										<UIcon name="i-heroicons-pencil-square" class="w-4 h-4 mr-2" />
										Edit Appointment
									</UButton>
									<UButton color="error" variant="soft" @click="deleteAppointment(selectedAppointment.code)">
										<UIcon name="i-heroicons-trash" class="w-4 h-4" />
									</UButton>
								</div>
							</div>
						</UCard>
					</div>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalAppointmentDetail, ZModalConfirmation } from '#components';
import { AppointmentStatus } from 'wemotoo-common';
import type { Appointment } from '~/utils/types/appointment';
import { capitalizeFirstLetter, formatAppointmentDateRange } from '~/utils/utils';

const overlay = useOverlay();
const appointmentStore = useAppointmentStore();
const { appointments, filter, exporting } = storeToRefs(appointmentStore);
const filteredAppointments = ref<Appointment[]>([]);
const selectedAppointment = ref<Appointment | null>(null);
const selectedTab = ref(0);

useHead({ title: 'Appointments' });

const appointmentTabs = computed(() => [
	{
		label: 'All',
		value: 'All',
	},
	{
		label: 'Pending',
		value: AppointmentStatus.PENDING,
	},
	{
		label: 'Confirmed',
		value: AppointmentStatus.CONFIRMED,
	},
	{
		label: 'Completed',
		value: AppointmentStatus.COMPLETED,
	},
	{
		label: 'Cancelled',
		value: AppointmentStatus.CANCELLED,
	},
]);

// Helper to get status badge color
const getStatusColor = (status: AppointmentStatus): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
	const colorMap: Record<string, string> = {
		[AppointmentStatus.PENDING]: 'warning',
		[AppointmentStatus.CONFIRMED]: 'success',
		[AppointmentStatus.COMPLETED]: 'info',
		[AppointmentStatus.CANCELLED]: 'error',
	};
	return colorMap[status] as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
};

// Display appointments based on filter state
const displayedAppointments = computed(() => {
	const result = appointments.value;

	// Sort by date
	return result.sort((a, b) => new Date(a.start_date_time).getTime() - new Date(b.start_date_time).getTime());
});

const deleteAppointment = async (code: string) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this appointment?',
			action: 'delete',
			onConfirm: async () => {
				await appointmentStore.deleteAppointment(code);
				confirmModal.close();
				// Clear selected appointment if it's the one being deleted
				if (selectedAppointment.value?.code === code) {
					selectedAppointment.value = null;
				}
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

onMounted(async () => {
	await appointmentStore.getAppointments();
});

const selectTab = async (index: number) => {
	selectedTab.value = index;
	filter.value.current_page = 1;
	filter.value.status = appointmentTabs.value[index]?.value as AppointmentStatus;
	await appointmentStore.getAppointments();
};

const selectAppointment = (appointment: Appointment) => {
	if (!appointment) return;
	selectedAppointment.value = appointment;
};

const openEditModal = async (appointment: Appointment) => {
	if (!appointment) return;

	const appointmentModal = overlay.create(ZModalAppointmentDetail, {
		props: {
			appointment: JSON.parse(JSON.stringify(appointment)),
			onUpdate: async (data: { date_time: string; ref_no: string; status: AppointmentStatus }) => {
				const { date_time, ref_no, status } = data;
				await appointmentStore.updateAppointment(appointment.code, date_time, ref_no, status);
				appointmentModal.close();
				// Update the selected appointment with the new data
				if (selectedAppointment.value?.code === appointment.code) {
					selectedAppointment.value = appointments.value.find((a) => a.code === appointment.code) || null;
				}
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

const exportAppointments = async () => {
	// await appointmentStore.exportAppointments();
};
</script>

<style scoped></style>
