<template>
	<div class="w-full py-4">
		<!-- Compact Filter Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
			<!-- Date Range Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Joined Date</label>
				<ZSelectMenuDateRange v-model="filter.joined_date" placeholder="Select date range" @update:model-value="handleDateRangeChange" />
			</div>

			<!-- Customer Search -->
			<div class="flex flex-col gap-1.5 sm:col-span-2">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Search</label>
				<UInput v-model="filter.query" placeholder="Search by Name / Phone No / Email..." :icon="ICONS.SEARCH_ROUNDED" @input="debouncedSearch" />
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-1.5 justify-end">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300 invisible">Actions</label>
				<div class="flex gap-2">
					<UButton variant="outline" color="neutral" :disabled="loading" @click="clearFilters">
						<UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
						Clear
					</UButton>
					<UButton color="primary" :disabled="loading" :loading="loading" @click="search">
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
				v-if="filter.joined_date && (filter.joined_date.start || filter.joined_date.end)"
				color="primary"
				variant="subtle"
				size="sm"
				@click="clearFilter('date')"
			>
				Joined Date: {{ formatDateRange(filter.joined_date) }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
			<UBadge v-if="filter.query" color="info" variant="subtle" size="sm" @click="clearFilter('query')">
				Search: {{ filter.query }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Range } from '~/utils/interface';
import { sub, format } from 'date-fns';

const customerStore = useCustomerStore();
const { filter, loading } = storeToRefs(customerStore);

const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const hasActiveFilters = computed(() => {
	const hasDateFilter = filter.value.joined_date && (filter.value.joined_date.start || filter.value.joined_date.end);
	return filter.value.query || hasDateFilter;
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

const search = async () => {
	await customerStore.getCustomers();
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
	filter.value.joined_date = {
		start: newValue.start ? new Date(newValue.start) : sub(new Date(), { days: 14 }),
		end: newValue.end ? new Date(newValue.end) : new Date(),
	};
	await search();
};

const clearFilters = async () => {
	filter.value.query = '';
	filter.value.joined_date = {
		start: undefined,
		end: undefined,
	};
	filter.value.current_page = 1;
	await search();
};

const clearFilter = async (filterKey: string) => {
	if (filterKey === 'query') {
		filter.value.query = '';
	} else if (filterKey === 'date') {
		filter.value.joined_date = {
			start: undefined,
			end: undefined,
		};
	}
	await search();
};

onUnmounted(() => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}
});
</script>

<style scoped></style>
