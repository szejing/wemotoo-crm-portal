<template>
	<div class="w-full py-4">
		<!-- Compact Filter Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
			<!-- Date Range Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Date Range</label>
				<ZSelectMenuDateRange v-model="filter.date_range" placeholder="Select date range" @update:model-value="handleDateRangeChange" />
			</div>

			<!-- Order Number Search -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Order No.</label>
				<UInput v-model="filter.query" placeholder="Search order no..." :icon="ICONS.SEARCH_ROUNDED" @input="debouncedSearch" />
			</div>

			<!-- Currency Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Currency</label>
				<ZSelectMenuCurrency v-model:currency-code="filter.currency_code" @update:model-value="handleCurrencyChange" />
			</div>

			<!-- Status Filter - Mobile Only -->
			<div class="flex flex-col gap-1.5 sm:hidden">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
				<ZSelectMenuOrderStatus v-model:status="filter.status" @update:model-value="handleStatusChange" />
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-1.5 justify-end">
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
				@click="clearFilter('date')"
			>
				Date: {{ formatDateRange(filter.date_range) }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
			<UBadge v-if="filter.query" color="info" variant="subtle" size="sm" @click="clearFilter('query')">
				Order: {{ filter.query }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
			<UBadge v-if="filter.status" color="success" variant="subtle" size="sm" @click="clearFilter('status')">
				Status: {{ capitalizeFirstLetter(filter.status) }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
			<UBadge v-if="filter.currency_code && filter.currency_code !== 'MYR'" color="warning" variant="subtle" size="sm">
				Currency: {{ filter.currency_code }}
			</UBadge>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Range } from '~/utils/interface';
import { sub, format } from 'date-fns';

const orderStore = useOrderStore();
const { filter } = storeToRefs(orderStore);

const is_loading = computed(() => orderStore.loading);
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const hasActiveFilters = computed(() => {
	const hasDateFilter = filter.value.date_range && (filter.value.date_range.start || filter.value.date_range.end);
	return filter.value.query || filter.value.status || (filter.value.currency_code && filter.value.currency_code !== 'MYR') || hasDateFilter;
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
	await orderStore.getOrders();
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

const handleCurrencyChange = async () => {
	await search();
};

const handleStatusChange = async () => {
	await search();
};

const clearFilters = async () => {
	filter.value.query = '';
	filter.value.status = undefined;
	filter.value.currency_code = 'MYR';
	filter.value.date_range = {
		start: sub(new Date(), { days: 14 }),
		end: new Date(),
	};
	filter.value.current_page = 1;
	await search();
};

const clearFilter = async (filterKey: string) => {
	if (filterKey === 'query') {
		filter.value.query = '';
	} else if (filterKey === 'status') {
		filter.value.status = undefined;
	} else if (filterKey === 'date') {
		filter.value.date_range = {
			start: sub(new Date(), { days: 14 }),
			end: new Date(),
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
