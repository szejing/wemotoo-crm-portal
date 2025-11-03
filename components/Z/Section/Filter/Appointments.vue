<template>
	<div class="w-full py-4">
		<!-- Compact Filter Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
			<!-- Date Range Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Date Range</label>
				<ZSelectMenuDateRange v-model="filter.date_range" placeholder="Select date range" @update:model-value="handleDateRangeChange" />
			</div>

			<!-- Search Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Search</label>
				<UInput v-model="filter.query" placeholder="Search by name, phone..." :icon="ICONS.SEARCH_ROUNDED" @input="debouncedSearch" />
			</div>

			<!-- Status Filter - Mobile Only -->
			<div class="flex flex-col gap-1.5 sm:hidden">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
				<USelect v-model="filter.status" :items="statusOptions" @update:model-value="handleStatusChange" />
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-1.5 justify-end lg:col-start-4">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300 invisible">Actions</label>
				<div class="flex gap-2">
					<UButton variant="outline" color="neutral" :disabled="is_loading" @click="clearFilters">
						<UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
						Clear
					</UButton>
					<UButton color="primary" :disabled="is_loading" :loading="is_loading" @click="search">
						<UIcon :name="ICONS.SEARCH_ROUNDED" class="w-4 h-4" />
						Search
					</UButton>
				</div>
			</div>
		</div>

		<!-- Active Filters Display -->
		<div v-if="hasActiveFilters" class="flex flex-wrap gap-2 items-center">
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
			<UBadge v-if="filter.query" color="info" variant="subtle" size="sm"> Search: {{ filter.query }} </UBadge>
			<UBadge v-if="filter.status && filter.status !== 'all'" color="success" variant="subtle" size="sm"> Status: {{ filter.status }} </UBadge>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { AppointmentStatus } from 'wemotoo-common';
import type { Range } from '~/utils/interface';
import { format } from 'date-fns';

const appointmentStore = useAppointmentStore();
const { loading, filter } = storeToRefs(appointmentStore);

const is_loading = computed(() => loading.value);
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const statusOptions = [
	{ label: 'All', value: 'all' },
	{ label: 'Pending', value: AppointmentStatus.PENDING },
	{ label: 'Confirmed', value: AppointmentStatus.CONFIRMED },
	{ label: 'Completed', value: AppointmentStatus.COMPLETED },
	{ label: 'Cancelled', value: AppointmentStatus.CANCELLED },
];

// Check if any filters are active
const hasActiveFilters = computed(() => {
	const hasDateFilter = filter.value.date_range && (filter.value.date_range.start || filter.value.date_range.end);
	return filter.value.query || (filter.value.status && filter.value.status !== 'all') || hasDateFilter;
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
	filter.value.date_range = newValue;
	await search();
};

const handleStatusChange = async () => {
	await search();
};

const clearFilters = async () => {
	filter.value.date_range = {};
	filter.value.query = '';
	filter.value.status = 'all';
	await search();
};

const clearFilter = async (filterKey: string) => {
	if (filterKey === 'query') {
		filter.value.query = '';
		await search();
	} else if (filterKey === 'status') {
		filter.value.status = 'all';
		await search();
	} else if (filterKey === 'date') {
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
