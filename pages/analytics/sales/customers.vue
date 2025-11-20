<template>
	<UDashboardPanel id="analytics-sales-customers">
		<template #header>
			<UDashboardNavbar title="Analytics Sales Customers" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterSaleSummCustomers />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<div v-if="!loading && data.length == 0">
					<div class="flex flex-col items-center justify-center py-6">
						<UIcon :name="ICONS.REPORT_SALES" class="w-12 h-12 text-gray-400" />
						<p class="text-sm text-gray-600 dark:text-gray-400">No sales customer summary data found.</p>
						<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
					</div>
				</div>

				<div v-else>
					<!-- Table Controls -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
						<!-- Page Size -->
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
							<USelect v-model="sale_summ_customer.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
							<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
						</div>
					</div>

					<UTable :data="data" :columns="sale_summ_customer_columns" :loading="loading" class="mt-4">
						<template #empty>
							<div class="flex flex-col items-center justify-center py-6">
								<UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400" />
								<p class="text-sm text-gray-600 dark:text-gray-400">No sales customer summary data found.</p>
								<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
							</div>
						</template>
					</UTable>
				</div>

				<div v-if="sale_summ_customer.data.length > 0" class="section-pagination">
					<UPagination
						:default-page="current_page"
						:items-per-page="sale_summ_customer.page_size"
						:total="sale_summ_customer.total_data"
						@update:page="updatePage"
					/>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { sale_summ_customer_columns } from '~/utils/table-columns';
import { options_page_size } from '~/utils/options';

useHead({ title: 'Wemotoo CRM - Sale Customer Summary' });

onMounted(async () => {
	await saleSummStore.getSaleCustomerSummary();
});

const saleSummStore = useSummSaleStore();
const { sale_summ_customer, loading } = storeToRefs(saleSummStore);
const data = computed(() => sale_summ_customer.value.data);
const current_page = computed(() => sale_summ_customer.value.current_page);

const updatePage = async (page: number) => {
	sale_summ_customer.value.current_page = page;
	await saleSummStore.getSaleCustomerSummary();
};

const updatePageSize = async (size: number) => {
	sale_summ_customer.value.page_size = size;

	if (sale_summ_customer.value.page_size > sale_summ_customer.value.total_data) {
		sale_summ_customer.value.current_page = 1;
		return;
	}

	await saleSummStore.getSaleCustomerSummary();
};
</script>

<style scoped></style>
