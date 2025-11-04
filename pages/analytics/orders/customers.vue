<template>
	<UDashboardPanel id="analytics-orders-customers">
		<template #header>
			<UDashboardNavbar title="Analytics Orders Customers" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<UButton
						variant="outline"
						:disabled="order_summ_customer.exporting"
						:loading="order_summ_customer.exporting"
						@click="exportOrderCustomerSummaryToCsv"
					>
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterOrderSummCustomers />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<div v-if="!is_loading && data.length == 0">
					<div class="flex flex-col items-center justify-center py-6">
						<UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400" />
						<p class="text-sm text-gray-600 dark:text-gray-400">No customer summary data found.</p>
						<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
					</div>
				</div>

				<div v-else>
					<!-- Table Controls -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
						<!-- Page Size -->
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
							<USelect v-model="order_summ_customer.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
							<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
						</div>
					</div>

					<!-- Table -->
					<UTable :data="data" :columns="order_summ_customer_columns" :loading="is_loading">
						<template #empty>
							<div class="flex flex-col items-center justify-center py-12 gap-3">
								<UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400" />
								<p class="text-sm text-gray-600 dark:text-gray-400">No customer summary data found.</p>
								<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
							</div>
						</template>
					</UTable>
				</div>

				<div v-if="order_summ_customer.data.length > 0" class="section-pagination">
					<UPagination
						:default-page="current_page"
						:items-per-page="order_summ_customer.page_size"
						:total="order_summ_customer.total_data"
						@update:page="updatePage"
					/>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { order_summ_customer_columns } from '~/utils/table-columns';
import { options_page_size } from '~/utils/options';

useHead({ title: 'Wemotoo CRM - Order Customer Summary' });

onMounted(async () => {
	await orderSummStore.getOrderCustomerSummary();
});

const orderSummStore = useSummOrderStore();
const { order_summ_customer } = storeToRefs(orderSummStore);

const is_loading = computed(() => order_summ_customer.value.loading);
const data = computed(() => order_summ_customer.value.data);
const current_page = computed(() => order_summ_customer.value.current_page);

const updatePage = async (page: number) => {
	order_summ_customer.value.current_page = page;
	await orderSummStore.getOrderCustomerSummary();
};

const updatePageSize = async (size: number) => {
	await orderSummStore.updateOrderCustomerSummPageSize(size);
};

const exportOrderCustomerSummaryToCsv = async () => {
	await orderSummStore.exportOrderCustomerSummary();
};
</script>

<style scoped></style>
