<!-- eslint-disable indent -->
<template>
	<UDashboardPanel id="appointments">
		<template #header>
			<UDashboardNavbar :title="$t('nav.appointments')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
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
							{{ tab.label }}
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
										<h3 class="font-semibold">{{ $t('pages.upcomingAppointments') }}</h3>
										<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
											{{ $t('pages.appointmentsCount', displayedAppointments.length) }}
										</p>
									</div>
								</div>
								<ZLoading v-if="appointmentStore.loading" />
								<div v-else-if="displayedAppointments.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
									<UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-gray-400" />
									<div class="text-center">
										<p class="font-medium text-gray-900 dark:text-white">{{ $t('pages.noAppointmentsFound') }}</p>
										<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
											{{ filter.query ? $t('pages.tryAdjustingFilters') : $t('pages.scheduleFirstAppointment') }}
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
													<span class="text-lg font-bold text-gray-900 dark:text-white"> {{ appointment.code }} </span>
												</div>
												<UBadge :color="getAppointmentStatusColor(appointment.status)" variant="subtle" size="sm">
													{{ $t('options.' + appointment.status.toLowerCase()) }}
												</UBadge>
											</div>
											<div class="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-lg">
												<div class="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
													<UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
												</div>
												<div class="flex-1">
													<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.appointmentDate') }}</p>
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
													<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ $t('pages.service') }}</p>
													<p class="font-medium text-gray-900 dark:text-white">{{ appointment.appt_desc || $t('pages.noDescription') }}</p>
												</div>
											</div>
											<div class="flex items-start gap-3">
												<div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
													<UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
												</div>
												<div class="flex-1 min-w-0">
													<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ $t('pages.customer') }}</p>
													<p class="font-medium text-gray-900 dark:text-white truncate">{{ appointment.customer_name }}</p>
													<p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ appointment.customer_phone }}</p>
												</div>
											</div>
											<div v-if="appointment.duration" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pl-1">
												<UIcon name="i-heroicons-clock" class="w-4 h-4" />
												<span>{{ $t('pages.durationMinutes', { n: appointment.duration }) }}</span>
											</div>
										</div>
									</UCard>
								</div>
							</UCard>
						</div>
						<div v-if="selectedAppointment" class="lg:col-span-2">
							<ZCalendarAppointmentDetail
								:appointment="selectedAppointment"
								:get-status-color="(s: string) => getAppointmentStatusColor(s as AppointmentStatus)"
								@close="selectedAppointment = null"
								@edit="openEditModal"
								@delete="deleteAppointment"
							/>
						</div>
					</div>
				</template>

				<!-- Daily view (UCalendar + timeslots, macOS Calendar style) -->
				<template v-else-if="appointmentStore.isDailyView">
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div :class="selectedAppointment ? 'lg:col-span-2' : 'lg:col-span-3'">
							<UCard>
								<div class="flex items-center justify-between mb-4">
									<h3 class="font-semibold">{{ $t('pages.dailyView') }}</h3>
									<div class="flex items-center gap-2">
										<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-left" @click="goPrevDay" />
										<span class="min-w-[180px] text-center font-medium">{{ format(calendarFocusDate, 'EEEE, d MMM yyyy') }}</span>
										<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-right" @click="goNextDay" />
										<UButton color="primary" variant="soft" size="sm" :label="$t('pages.today')" @click="goToTodayMonth" />
									</div>
								</div>
								<ZLoading v-if="appointmentStore.loading" />
								<div v-else class="flex flex-col lg:flex-row gap-6">
									<div class="shrink-0">
										<UCard class="p-2">
											<UCalendar
												:model-value="dailyCalendarDate"
												@update:model-value="onDailyCalendarDateSelect"
												:month-controls="true"
												:year-controls="true"
											/>
										</UCard>
									</div>
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
						</div>
						<div v-if="selectedAppointment" class="lg:col-span-1">
							<div class="lg:sticky lg:top-4">
								<ZCalendarAppointmentDetail
									:appointment="selectedAppointment"
									:get-status-color="(s: string) => getAppointmentStatusColor(s as AppointmentStatus)"
									@close="selectedAppointment = null"
									@edit="openEditModal"
									@delete="deleteAppointment"
								/>
							</div>
						</div>
					</div>
				</template>

				<!-- Weekly view (timeslots, macOS Calendar style) -->
				<template v-else-if="appointmentStore.isWeeklyView">
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div :class="selectedAppointment ? 'lg:col-span-2' : 'lg:col-span-3'">
							<UCard>
								<div class="flex items-center justify-between mb-4">
									<h3 class="font-semibold">{{ $t('pages.weeklyView') }}</h3>
									<div class="flex items-center gap-2">
										<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-left" @click="goPrevWeek" />
										<span class="min-w-[200px] text-center font-medium">
											{{ format(weekStartDate, 'd MMM') }} – {{ format(add(weekStartDate, { days: 6 }), 'd MMM yyyy') }}
										</span>
										<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-right" @click="goNextWeek" />
										<UButton color="primary" variant="soft" size="sm" :label="$t('pages.today')" @click="goToTodayMonth" />
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
						</div>
						<div v-if="selectedAppointment" class="lg:col-span-1">
							<div class="lg:sticky lg:top-4">
								<ZCalendarAppointmentDetail
									:appointment="selectedAppointment"
									:get-status-color="(s: string) => getAppointmentStatusColor(s as AppointmentStatus)"
									@close="selectedAppointment = null"
									@edit="openEditModal"
									@delete="deleteAppointment"
								/>
							</div>
						</div>
					</div>
				</template>

				<!-- Monthly view (full calendar grid with appointments in each day) -->
				<template v-else-if="appointmentStore.isMonthlyView">
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div :class="selectedAppointment ? 'lg:col-span-2' : 'lg:col-span-3'">
							<UCard>
								<div class="flex items-center justify-between mb-4">
									<h3 class="font-semibold">{{ $t('pages.monthlyView') }}</h3>
									<div class="flex items-center gap-2">
										<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-left" @click="goPrevMonth" />
										<span class="min-w-[160px] text-center font-medium">{{ format(monthDate, 'MMMM yyyy') }}</span>
										<UButton color="neutral" variant="outline" size="sm" icon="i-heroicons-chevron-right" @click="goNextMonth" />
										<UButton color="primary" variant="soft" size="sm" :label="$t('pages.today')" @click="goToTodayMonth" />
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
						</div>
						<div v-if="selectedAppointment" class="lg:col-span-1">
							<div class="lg:sticky lg:top-4">
								<ZCalendarAppointmentDetail
									:appointment="selectedAppointment"
									:get-status-color="(s: string) => getAppointmentStatusColor(s as AppointmentStatus)"
									@close="selectedAppointment = null"
									@edit="openEditModal"
									@delete="deleteAppointment"
								/>
							</div>
						</div>
					</div>
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
import { formatAppointmentDateRange } from '~/utils/utils';
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

const { t } = useI18n();
useHead({ title: () => t('pages.appointmentsTitle') });

const dateKey = (d: Date) => format(d, 'yyyy-MM-dd');

const appointmentTabs = computed(() => [
	{ label: t('options.all'), value: 'All' },
	{ label: t('options.pending'), value: AppointmentStatus.PENDING },
	{ label: t('options.confirmed'), value: AppointmentStatus.CONFIRMED },
	{ label: t('options.completed'), value: AppointmentStatus.COMPLETED },
	{ label: t('options.cancelled'), value: AppointmentStatus.CANCELLED },
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
	filter.value.date_range = { start: startOfDay(d), end: endOfDay(add(d, { days: 1 })) };
	await appointmentStore.getAppointments();
};

const goPrevDay = async () => {
	calendarFocusDate.value = sub(calendarFocusDate.value, { days: 1 });
	filter.value.date_range = { start: startOfDay(calendarFocusDate.value), end: endOfDay(add(calendarFocusDate.value, { days: 1 })) };
	await appointmentStore.getAppointments();
};

const goNextDay = async () => {
	calendarFocusDate.value = add(calendarFocusDate.value, { days: 1 });
	filter.value.date_range = { start: startOfDay(calendarFocusDate.value), end: endOfDay(add(calendarFocusDate.value, { days: 1 })) };
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
			message: t('pages.confirmDeleteAppointment'),
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
		selectedAppointment.value = null;
		if (view === 'monthly') {
			const start = new Date(calendarPlaceholder.value.year, calendarPlaceholder.value.month - 1, 1);
			const end = endOfMonth(start);
			filter.value.date_range = { start, end };
			appointmentStore.getAppointments();
		} else if (view === 'daily') {
			calendarFocusDate.value = new Date();
			filter.value.date_range = {
				start: startOfDay(calendarFocusDate.value),
				end: endOfDay(add(calendarFocusDate.value, { days: 1 })),
			};
			appointmentStore.getAppointments();
		} else if (view === 'weekly') {
			const start = startOfWeek(new Date(), { weekStartsOn: 1 });
			const end = endOfWeek(start, { weekStartsOn: 1 });
			calendarFocusDate.value = start;
			filter.value.date_range = { start, end };
			appointmentStore.getAppointments();
		} else {
			filter.value.date_range = {
				start: startOfDay(calendarFocusDate.value),
				end: endOfDay(add(calendarFocusDate.value, { days: 14 })),
			};
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
