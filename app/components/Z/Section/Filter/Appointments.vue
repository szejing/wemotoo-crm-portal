<template>
	<div class="w-full py-4">
		<!-- Status + Date range filters (flex column) -->
		<div class="flex flex-col gap-4 mb-4">
			<!-- Status Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
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
			<!-- Date range: presets + picker (same row, picker last) -->
			<div class="flex flex-wrap items-end gap-3">
				<div class="flex flex-col gap-1.5">
					<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Date range</label>
					<div class="flex flex-wrap gap-2">
						<UButton
							v-for="(tab, index) in dateRangeTabs"
							:key="tab.value"
							:variant="selectedDateRangeTab === index ? 'solid' : 'soft'"
							:color="selectedDateRangeTab === index ? 'primary' : 'neutral'"
							@click="selectDateRangeTab(index)"
						>
							{{ tab.label }}
						</UButton>
						<ZSelectMenuDateRange
							v-model="filter.date_range"
							placeholder="Select date range"
							@update:model-value="handleDateRangeChange"
							:button-variant="selectedDateRangeTab === -1 ? 'solid' : 'soft'"
							:button-color="selectedDateRangeTab === -1 ? 'primary' : 'neutral'"
						/>
					</div>
				</div>
			</div>
		</div>
		<!-- Search Filter -->
		<div class="flex flex-col col-span-2 sm:col-span-1 gap-1.5">
			<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Search</label>
			<UInput v-model="filter.query" placeholder="Search by name, phone..." :icon="ICONS.SEARCH_ROUNDED" @input="debouncedSearch" />
		</div>

		<!-- Active Filters Display -->
		<div v-if="hasActiveFilters" class="flex flex-wrap gap-2 items-center mt-4">
			<span class="text-xs text-gray-600 dark:text-gray-400">Active filters:</span>
			<UBadge
				v-if="filter.date_range && (filter.date_range.start || filter.date_range.end)"
				color="primary"
				variant="subtle"
				size="sm"
				@click="clearFilter('date_range')"
			>
				Date: {{ formatDateRange(filter.date_range) }}
			</UBadge>
			<UBadge v-if="filter.query" color="info" variant="subtle" size="sm">
				Search: {{ filter.query }} <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
			<UBadge v-if="filter.status && filter.status !== 'All'" color="success" variant="subtle" size="sm" @click="clearFilter('status')">
				Status: {{ filter.status }} <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { AppointmentStatus } from 'wemotoo-common';
import type { Range } from '~/utils/interface';
import { capitalizeFirstLetter } from '~/utils/utils';
import { format } from 'date-fns';

const appointmentStore = useAppointmentStore();
const { loading, filter } = storeToRefs(appointmentStore);

const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const selectedTab = ref(0);
const selectedDateRangeTab = ref<number | null>(null);

const appointmentTabs = computed(() => [
	{ label: 'All', value: 'All' },
	{ label: 'Pending', value: AppointmentStatus.PENDING },
	{ label: 'Confirmed', value: AppointmentStatus.CONFIRMED },
	{ label: 'Completed', value: AppointmentStatus.COMPLETED },
	{ label: 'Cancelled', value: AppointmentStatus.CANCELLED },
]);

const getDateRangeForPreset = (preset: 'today' | 'week' | 'month'): Range => {
	const now = new Date();
	switch (preset) {
		case 'today':
			return { start: startOfDay(now), end: endOfDay(now) };
		case 'week':
			return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
		case 'month':
			return { start: startOfMonth(now), end: endOfMonth(now) };
		default:
			return { start: now, end: now };
	}
};

const dateRangeTabs = [
	{ label: 'Today', value: 'today' as const },
	{ label: 'This week', value: 'week' as const },
	{ label: 'This month', value: 'month' as const },
];

// Check if any filters are active
const hasActiveFilters = computed(() => {
	const hasDateFilter = filter.value.date_range && (filter.value.date_range.start || filter.value.date_range.end);
	return filter.value.query || (filter.value.status && filter.value.status !== 'All') || hasDateFilter;
});

const formatDateRange = (range: Range) => {
	if (!range) return '';
	const startDate = range.start ? format(new Date(range.start), 'dd/MM/yyyy') : '';
	const endDate = range.end ? format(new Date(range.end), 'dd/MM/yyyy') : '';
	if (startDate && endDate) {
		return `${startDate} - ${endDate}`;
	}
	return startDate || endDate;
};

// Emit events to parent
const search = async () => {
	await appointmentStore.getAppointments();
};

const debouncedSearch = () => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}
	searchTimeout.value = setTimeout(async () => {
		await search();
	}, 500);
};

const handleDateRangeChange = async (newValue: Range) => {
	selectedDateRangeTab.value = -1;
	filter.value.date_range = newValue;
	await search();
};

const selectTab = async (index: number) => {
	selectedTab.value = index;
	filter.value.current_page = 1;
	filter.value.status = appointmentTabs.value[index]?.value as AppointmentStatus | string;
	await search();
};

const selectDateRangeTab = async (index: number) => {
	const tab = dateRangeTabs[index];
	if (!tab) return;
	selectedDateRangeTab.value = index;
	filter.value.current_page = 1;
	filter.value.date_range = getDateRangeForPreset(tab.value);
	await search();
};

const clearFilters = async () => {
	selectedTab.value = 0;
	selectedDateRangeTab.value = null;
	filter.value.date_range = {};
	filter.value.query = '';
	filter.value.status = 'All';
	await search();
};

const clearFilter = async (filterKey: string) => {
	if (filterKey === 'query') {
		filter.value.query = '';
		await search();
	} else if (filterKey === 'status') {
		selectedTab.value = 0;
		filter.value.status = 'All';
		await search();
	} else if (filterKey === 'date_range' || filterKey === 'date') {
		selectedDateRangeTab.value = null;
		filter.value.date_range = {};
		await search();
	}
};

onUnmounted(() => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}
});

// Expose methods for parent to call
defineExpose({
	clearFilters,
	filter,
});
</script>

<style scoped></style>
