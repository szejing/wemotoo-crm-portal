<!-- eslint-disable indent -->
<template>
	<UDashboardPanel id="appointments">
		<template #header>
			<UDashboardNavbar title="Appointments" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar :ui="{ left: 'w-full', right: 'items-start justify-start' }">
				<template #left>
					<ZSectionFilterAppointments />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Status Filter -->
				<div class="flex flex-col gap-1.5">
					<div class="flex flex-wrap gap-2">
						<UButton
							v-for="(tab, index) in appointmentTabs"
							:key="tab.value"
							:variant="selectedTab === index ? 'solid' : 'soft'"
							:color="selectedTab === index ? 'primary' : 'neutral'"
							@click="selectTab(index)"
						>
							{{ capitalizeFirstLetter(tab.label) }}
						</UButton>
					</div>
				</div>

				<!-- Listing view (default) -->
				<template v-if="appointmentStore.isListingView">
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div :class="selectedAppointment ? 'lg:col-span-1' : 'lg:col-span-3'">
							<UCard>
								<div class="flex items-center justify-between mb-4">
									<div>
										<h3 class="font-semibold">Upcoming Appointments</h3>
										<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
											{{ displayedAppointments.length }} appointment{{ displayedAppointments.length !== 1 ? 's' : '' }}
										</p>
									</div>
								</div>
								<ZLoading v-if="appointmentStore.loading" />
								<div v-else-if="displayedAppointments.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
									<UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-gray-400" />
									<div class="text-center">
										<p class="font-medium text-gray-900 dark:text-white">No appointments found</p>
										<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
											{{ filter.query ? 'Try adjusting your filters' : 'Schedule your first appointment to get started' }}
										</p>
									</div>
								</div>
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
											<div class="flex items-center justify-between">
												<div class="flex items-center gap-2">
													<UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
													<span class="text-lg font-bold text-gray-900 dark:text-white"> {{ appointment.order_no }} </span>
												</div>
												<UBadge :color="getAppointmentStatusColor(appointment.status)" variant="subtle" size="sm">
													{{ appointment.status.toUpperCase() }}
												</UBadge>
											</div>
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
											<div class="flex items-start gap-3">
												<div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
													<UIcon name="i-heroicons-wrench" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
												</div>
												<div class="flex-1 min-w-0">
													<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Service</p>
													<p class="font-medium text-gray-900 dark:text-white">{{ appointment.appt_desc || 'No description' }}</p>
												</div>
											</div>
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
											<div v-if="appointment.duration" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pl-1">
												<UIcon name="i-heroicons-clock" class="w-4 h-4" />
												<span>Duration: {{ appointment.duration }} minutes</span>
											</div>
										</div>
									</UCard>
								</div>
							</UCard>
						</div>
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
										<UBadge :color="getAppointmentStatusColor(selectedAppointment.status)" variant="subtle" size="md">
											{{ selectedAppointment.status.toUpperCase() }}
										</UBadge>
										<UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="selectedAppointment = null" />
									</div>
								</div>
								<div class="space-y-6">
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
				</template>

				<!-- Daily view (UCalendar + timeslots, macOS Calendar style) -->
				<template v-else-if="appointmentStore.isDailyView">
					<UCard>
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-semibold">Daily view</h3>
							<div class="flex items-center gap-2">
								<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-left" @click="goPrevDay" />
								<span class="min-w-[180px] text-center font-medium">{{ format(calendarFocusDate, 'EEEE, d MMM yyyy') }}</span>
								<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-right" @click="goNextDay" />
								<UButton color="primary" variant="soft" size="sm" label="Today" @click="goToTodayMonth" />
							</div>
						</div>
						<ZLoading v-if="appointmentStore.loading" />
						<div v-else class="flex flex-col lg:flex-row gap-6">
							<!-- UCalendar: select day to navigate daily view -->
							<div class="shrink-0">
								<UCard class="p-2">
									<UCalendar :model-value="dailyCalendarDate" @update:model-value="onDailyCalendarDateSelect" :month-controls="true" :year-controls="true" />
								</UCard>
							</div>
							<!-- Daily timeslots for selected day -->
							<div class="flex-1 min-w-0 min-h-[400px]">
								<ZCalendarDailySlots
									:date="calendarFocusDate"
									:appointments="dailyAppointments"
									:selected-code="selectedAppointment?.code ?? null"
									:get-status-color="(s: string) => getAppointmentStatusColor(s as AppointmentStatus)"
									@select="selectAppointment"
								/>
							</div>
						</div>
					</UCard>
					<UCard v-if="selectedAppointment" class="mt-6">
						<div class="flex items-center justify-between mb-4">
							<h4 class="font-semibold">Appointment details</h4>
							<UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="selectedAppointment = null" />
						</div>
						<div class="space-y-4">
							<p class="font-bold text-gray-900 dark:text-white">{{ selectedAppointment.order_no }}</p>
							<p>{{ formatAppointmentDateRange(selectedAppointment.start_date_time, selectedAppointment.end_date_time) }}</p>
							<p>{{ selectedAppointment.appt_desc || 'No description' }}</p>
							<p>{{ selectedAppointment.customer_name }} · {{ selectedAppointment.customer_phone }}</p>
							<div class="flex gap-2">
								<UButton color="primary" size="sm" @click="openEditModal(selectedAppointment)">Edit</UButton>
								<UButton color="error" variant="soft" size="sm" @click="deleteAppointment(selectedAppointment.code)">Delete</UButton>
							</div>
						</div>
					</UCard>
				</template>

				<!-- Weekly view (timeslots, macOS Calendar style) -->
				<template v-else-if="appointmentStore.isWeeklyView">
					<UCard>
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-semibold">Weekly view</h3>
							<div class="flex items-center gap-2">
								<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-left" @click="goPrevWeek" />
								<span class="min-w-[200px] text-center font-medium">
									{{ format(weekStartDate, 'd MMM') }} – {{ format(add(weekStartDate, { days: 6 }), 'd MMM yyyy') }}
								</span>
								<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-right" @click="goNextWeek" />
								<UButton color="primary" variant="soft" size="sm" label="Today" @click="goToTodayMonth" />
							</div>
						</div>
						<ZLoading v-if="appointmentStore.loading" />
						<div v-else class="min-h-[500px]">
							<ZCalendarWeeklySlots
								:week-start="weekStartDate"
								:appointments="appointments"
								:selected-code="selectedAppointment?.code ?? null"
								:get-status-color="(s: string) => getAppointmentStatusColor(s as AppointmentStatus)"
								@select="selectAppointment"
							/>
						</div>
					</UCard>
					<UCard v-if="selectedAppointment" class="mt-6">
						<div class="flex items-center justify-between mb-4">
							<h4 class="font-semibold">Appointment details</h4>
							<UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="selectedAppointment = null" />
						</div>
						<div class="space-y-4">
							<p class="font-bold">{{ selectedAppointment.order_no }}</p>
							<p>{{ formatAppointmentDateRange(selectedAppointment.start_date_time, selectedAppointment.end_date_time) }}</p>
							<p>{{ selectedAppointment.appt_desc || 'No description' }}</p>
							<p>{{ selectedAppointment.customer_name }} · {{ selectedAppointment.customer_phone }}</p>
							<div class="flex gap-2">
								<UButton color="primary" size="sm" @click="openEditModal(selectedAppointment)">Edit</UButton>
								<UButton color="error" variant="soft" size="sm" @click="deleteAppointment(selectedAppointment.code)">Delete</UButton>
							</div>
						</div>
					</UCard>
				</template>

				<!-- Monthly view (full calendar grid with appointments in each day) -->
				<template v-else-if="appointmentStore.isMonthlyView">
					<UCard>
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-semibold">Monthly view</h3>
							<div class="flex items-center gap-2">
								<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-left" @click="goPrevMonth" />
								<span class="min-w-[160px] text-center font-medium">{{ format(monthDate, 'MMMM yyyy') }}</span>
								<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-right" @click="goNextMonth" />
								<UButton color="primary" variant="soft" size="sm" label="Today" @click="goToTodayMonth" />
							</div>
						</div>
						<ZLoading v-if="appointmentStore.loading" />
						<div v-else class="min-h-[480px]">
							<ZCalendarMonthlyGrid
								:month="monthDate"
								:appointments="appointments"
								:selected-code="selectedAppointment?.code ?? null"
								:selected-day="selectedCalendarDay"
								:get-status-color="(s: string) => getAppointmentStatusColor(s as AppointmentStatus)"
								@select-day="selectDayInCalendarFromDate"
								@select-appointment="selectAppointment"
							/>
						</div>
					</UCard>
					<UCard v-if="selectedAppointment" class="mt-6">
						<div class="flex items-center justify-between mb-3">
							<h4 class="font-semibold">Details</h4>
							<UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="selectedAppointment = null" />
						</div>
						<p class="font-bold">{{ selectedAppointment.order_no }}</p>
						<p class="text-sm">{{ formatAppointmentDateRange(selectedAppointment.start_date_time, selectedAppointment.end_date_time) }}</p>
						<p class="text-sm">{{ selectedAppointment.customer_name }} · {{ selectedAppointment.customer_phone }}</p>
						<div class="flex gap-2 mt-3">
							<UButton color="primary" size="sm" @click="selectedAppointment && openEditModal(selectedAppointment)">Edit</UButton>
							<UButton color="error" variant="soft" size="sm" @click="selectedAppointment && deleteAppointment(selectedAppointment.code)">Delete</UButton>
						</div>
					</UCard>
				</template>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { CalendarDate, type DateValue } from '@internationalized/date';
import { ZModalAppointmentDetail, ZModalConfirmation } from '#components';
import { add, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfWeek, sub } from 'date-fns';
import { format } from 'date-fns';
import { AppointmentStatus } from 'wemotoo-common';
import type { Appointment } from '~/utils/types/appointment';
import { capitalizeFirstLetter, formatAppointmentDateRange } from '~/utils/utils';
import { getAppointmentStatusColor } from '~/utils/ui-utils';

const overlay = useOverlay();
const appointmentStore = useAppointmentStore();
const { appointments, filter, exporting } = storeToRefs(appointmentStore);
const selectedAppointment = ref<Appointment | null>(null);

// Calendar view state
const today = new Date();
const calendarPlaceholder = ref(new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1));
const calendarFocusDate = ref(new Date());
const selectedCalendarDay = ref<Date | null>(null);
const selectedTab = ref(0);

useHead({ title: 'Appointments' });

const dateKey = (d: Date) => format(d, 'yyyy-MM-dd');

const appointmentTabs = computed(() => [
	{ label: 'All', value: 'All' },
	{ label: 'Pending', value: AppointmentStatus.PENDING },
	{ label: 'Confirmed', value: AppointmentStatus.CONFIRMED },
	{ label: 'Completed', value: AppointmentStatus.COMPLETED },
	{ label: 'Cancelled', value: AppointmentStatus.CANCELLED },
]);

// Appointments grouped by date (YYYY-MM-DD)
const appointmentsByDate = computed(() => {
	const map: Record<string, Appointment[]> = {};
	for (const a of appointments.value) {
		const key = dateKey(new Date(a.start_date_time));
		if (!map[key]) map[key] = [];
		map[key].push(a);
	}
	for (const key of Object.keys(map)) {
		const arr = map[key];
		if (arr) arr.sort((x, y) => new Date(x.start_date_time).getTime() - new Date(y.start_date_time).getTime());
	}
	return map;
});

// For daily view: appointments on the focused day
const dailyAppointments = computed(() => {
	const key = dateKey(calendarFocusDate.value);
	return appointmentsByDate.value[key] ?? [];
});

// For weekly view: start of week (Monday) and 7 days
const weekStartDate = computed(() => startOfWeek(calendarFocusDate.value, { weekStartsOn: 1 }));
const weekDays = computed(() => {
	const start = weekStartDate.value;
	return Array.from({ length: 7 }, (_, i) => add(start, { days: i }));
});
const appointmentsByWeekDay = computed(() => {
	return weekDays.value.map((d) => ({ date: d, appointments: appointmentsByDate.value[dateKey(d)] ?? [] }));
});

// For monthly view: appointments on the selected day (when user clicks a day)
const selectedDayAppointments = computed(() => {
	if (!selectedCalendarDay.value) return [];
	return appointmentsByDate.value[dateKey(selectedCalendarDay.value)] ?? [];
});

// Daily view: CalendarDate for UCalendar (single-day picker)
const dailyCalendarDate = computed(
	() => new CalendarDate(calendarFocusDate.value.getFullYear(), calendarFocusDate.value.getMonth() + 1, calendarFocusDate.value.getDate()),
);

// Display appointments based on filter state (listing view)
const displayedAppointments = computed(() => {
	const result = [...appointments.value];
	return result.sort((a, b) => new Date(a.start_date_time).getTime() - new Date(b.start_date_time).getTime());
});

const monthDate = computed(() => new Date(calendarPlaceholder.value.year, calendarPlaceholder.value.month - 1, 1));

const selectTab = async (index: number) => {
	selectedTab.value = index;
	filter.value.current_page = 1;
	filter.value.status = appointmentTabs.value[index]?.value as AppointmentStatus | string;
	await search();
};

// Emit events to parent
const search = async () => {
	await appointmentStore.getAppointments();
};
const onDailyCalendarDateSelect = async (value: DateValue | DateValue[] | { start?: DateValue; end?: DateValue } | null | undefined) => {
	const dateValue =
		value == null ? null : Array.isArray(value) ? value[0] : 'start' in (value as object) ? (value as { start?: DateValue }).start : (value as DateValue);
	if (!dateValue || !('year' in dateValue) || !('month' in dateValue) || !('day' in dateValue)) return;
	const d = new Date(dateValue.year, dateValue.month - 1, dateValue.day);
	calendarFocusDate.value = d;
	filter.value.date_range = { start: startOfDay(d), end: endOfDay(d) };
	await appointmentStore.getAppointments();
};

const goPrevDay = async () => {
	calendarFocusDate.value = sub(calendarFocusDate.value, { days: 1 });
	filter.value.date_range = { start: startOfDay(calendarFocusDate.value), end: endOfDay(calendarFocusDate.value) };
	await appointmentStore.getAppointments();
};

const goNextDay = async () => {
	calendarFocusDate.value = add(calendarFocusDate.value, { days: 1 });
	filter.value.date_range = { start: startOfDay(calendarFocusDate.value), end: endOfDay(calendarFocusDate.value) };
	await appointmentStore.getAppointments();
};

const goPrevWeek = async () => {
	calendarFocusDate.value = sub(weekStartDate.value, { days: 7 });
	const start = weekStartDate.value;
	const end = endOfWeek(calendarFocusDate.value, { weekStartsOn: 1 });
	filter.value.date_range = { start, end };
	await appointmentStore.getAppointments();
};

const goNextWeek = async () => {
	calendarFocusDate.value = add(weekStartDate.value, { days: 7 });
	const start = weekStartDate.value;
	const end = endOfWeek(calendarFocusDate.value, { weekStartsOn: 1 });
	filter.value.date_range = { start, end };
	await appointmentStore.getAppointments();
};

const goPrevMonth = async () => {
	const prev = sub(monthDate.value, { months: 1 });
	calendarPlaceholder.value = new CalendarDate(prev.getFullYear(), prev.getMonth() + 1, 1);
	const start = new Date(prev.getFullYear(), prev.getMonth(), 1);
	const end = endOfMonth(start);
	filter.value.date_range = { start, end };
	await appointmentStore.getAppointments();
};

const goNextMonth = async () => {
	const next = add(monthDate.value, { months: 1 });
	calendarPlaceholder.value = new CalendarDate(next.getFullYear(), next.getMonth() + 1, 1);
	const start = new Date(next.getFullYear(), next.getMonth(), 1);
	const end = endOfMonth(start);
	filter.value.date_range = { start, end };
	await appointmentStore.getAppointments();
};

const goToTodayMonth = async () => {
	const now = new Date();
	calendarPlaceholder.value = new CalendarDate(now.getFullYear(), now.getMonth() + 1, 1);
	const start = new Date(now.getFullYear(), now.getMonth(), 1);
	const end = endOfMonth(start);
	filter.value.date_range = { start, end };
	await appointmentStore.getAppointments();
};

const selectDayInCalendarFromDate = (date: Date) => {
	selectedCalendarDay.value = date;
};

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

// When switching to a calendar view, set date range and refetch
watch(
	() => filter.value.view,
	(view) => {
		if (view === 'monthly') {
			const start = new Date(calendarPlaceholder.value.year, calendarPlaceholder.value.month - 1, 1);
			const end = endOfMonth(start);
			filter.value.date_range = { start, end };
			appointmentStore.getAppointments();
		} else if (view === 'daily') {
			calendarFocusDate.value = new Date();
			filter.value.date_range = {
				start: startOfDay(calendarFocusDate.value),
				end: endOfDay(calendarFocusDate.value),
			};
			appointmentStore.getAppointments();
		} else if (view === 'weekly') {
			const start = startOfWeek(new Date(), { weekStartsOn: 1 });
			const end = endOfWeek(start, { weekStartsOn: 1 });
			calendarFocusDate.value = start;
			filter.value.date_range = { start, end };
			appointmentStore.getAppointments();
		}
	},
	{ immediate: false },
);

onMounted(async () => {
	await appointmentStore.getAppointments();
});

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
