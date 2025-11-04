<template>
	<div class="w-full py-4">
		<!-- Compact Filter Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
			<!-- Date Range Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Date Range</label>
				<ZSelectMenuDateRange
					:model-value="{ start: filter.start_date, end: filter.end_date }"
					placeholder="Select date range"
					@update:model-value="handleDateRangeChange"
				/>
			</div>

			<!-- Order Status Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Order Status</label>
				<ZSelectMenuOrderStatus v-model:status="filter.status" @update:model-value="handleStatusChange" />
			</div>

			<!-- Currency Filter -->
			<div class="flex flex-col gap-1.5">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Currency</label>
				<ZSelectMenuCurrency v-model:currency-code="filter.currency_code" @update:model-value="handleCurrencyChange" />
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-1.5 justify-end sm:col-span-2">
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
			<UBadge v-if="filter.start_date || filter.end_date" color="primary" variant="subtle" size="sm" @click="clearFilter('date')">
				Date: {{ formatDateRange({ start: filter.start_date, end: filter.end_date }) }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
			<UBadge v-if="filter.status" color="success" variant="subtle" size="sm" @click="clearFilter('status')">
				Status: {{ capitalizeFirstLetter(filter.status) }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
			<UBadge v-if="filter.currency_code && filter.currency_code !== 'MYR'" color="warning" variant="subtle" size="sm" @click="clearFilter('currency')">
				Currency: {{ filter.currency_code }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { Range } from '~/utils/interface';
import { format } from 'date-fns';
import { OrderStatus } from 'wemotoo-common';

const salesSummStore = useSummSaleStore();
const { sale_summ_items } = storeToRefs(salesSummStore);
const filter = computed(() => sale_summ_items.value.filter);

const is_loading = computed(() => sale_summ_items.value.is_loading);

const hasActiveFilters = computed(() => {
	return filter.value.start_date || filter.value.end_date || filter.value.status || (filter.value.currency_code && filter.value.currency_code !== 'MYR');
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
	await salesSummStore.getSaleItemSummary();
};

const handleDateRangeChange = async (newValue: Range) => {
	filter.value.start_date = newValue.start ? new Date(newValue.start) : new Date();
	filter.value.end_date = newValue.end ? new Date(newValue.end) : undefined;
	await search();
};

const handleStatusChange = async () => {
	await search();
};

const handleCurrencyChange = async () => {
	await search();
};

const clearFilters = async () => {
	filter.value.start_date = new Date();
	filter.value.end_date = undefined;
	filter.value.status = OrderStatus.PENDING_PAYMENT;
	filter.value.currency_code = 'MYR';
	sale_summ_items.value.current_page = 1;
	await search();
};

const clearFilter = async (filterKey: string) => {
	if (filterKey === 'date') {
		filter.value.start_date = new Date();
		filter.value.end_date = undefined;
	} else if (filterKey === 'status') {
		filter.value.status = OrderStatus.PENDING_PAYMENT;
	} else if (filterKey === 'currency') {
		filter.value.currency_code = 'MYR';
	}
	await search();
};
</script>

<style scoped></style>
