<template>
	<div class="w-full py-4">
		<!-- Compact Filter Grid -->
		<div class="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
			<!-- Payment Method Search -->
			<div class="flex flex-col gap-1.5 col-span-3 sm:col-span-2">
				<label class="text-xs font-medium text-gray-700 dark:text-gray-300">Search</label>
				<UInput v-model="filter.query" placeholder="Search by Code / Description..." :icon="ICONS.SEARCH_ROUNDED" @input="debouncedSearch" />
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-1.5 justify-end">
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
			<UBadge v-if="filter.query" color="info" variant="subtle" size="sm" @click="clearFilter('query')">
				Search: {{ filter.query }}
				<UIcon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 cursor-pointer" />
			</UBadge>
		</div>
	</div>
</template>

<script lang="ts" setup>
const taxStore = useTaxStore();
const { filter } = storeToRefs(taxStore);

const is_loading = computed(() => taxStore.loading);
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const hasActiveFilters = computed(() => {
	return filter.value.query;
});

const search = async () => {
	await taxStore.getTaxes();
};

const debouncedSearch = () => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}
	searchTimeout.value = setTimeout(async () => {
		await search();
	}, 500);
};

const clearFilters = async () => {
	filter.value.query = '';
	await search();
};

const clearFilter = async (filterKey: string) => {
	if (filterKey === 'query') {
		filter.value.query = '';
	}
};
</script>

<style scoped></style>
