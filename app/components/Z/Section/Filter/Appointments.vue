<template>
	<div class="w-full py-4 space-y-4">
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
		<!-- Search Filter -->
		<div class="flex flex-col col-span-2 sm:col-span-1 gap-1.5">
			<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Search</label>
			<UInput v-model="filter.query" placeholder="Search by name, phone..." :icon="ICONS.SEARCH_ROUNDED" @input="debouncedSearch" />
		</div>

		<!-- Active Filters Display -->
		<div v-if="hasActiveFilters" class="flex flex-wrap gap-2 items-center">
			<span class="text-xs text-gray-600 dark:text-gray-400">Active filters:</span>

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
import { AppointmentStatus } from 'wemotoo-common';
import { capitalizeFirstLetter } from '~/utils/utils';

const appointmentStore = useAppointmentStore();
const { filter } = storeToRefs(appointmentStore);

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

// Check if any filters are active
const hasActiveFilters = computed(() => {
	const hasDateFilter = filter.value.date_range && (filter.value.date_range.start || filter.value.date_range.end);
	return filter.value.query || (filter.value.status && filter.value.status !== 'All') || hasDateFilter;
});

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

const selectTab = async (index: number) => {
	selectedTab.value = index;
	filter.value.current_page = 1;
	filter.value.status = appointmentTabs.value[index]?.value as AppointmentStatus | string;
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
