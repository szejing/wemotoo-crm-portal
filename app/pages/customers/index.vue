<template>
	<UDashboardPanel id="customers">
		<template #header>
			<UDashboardNavbar title="Customers" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterCustomers />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table Controls -->
				<div class="flex flex-row sm:items-center justify-between sm:justify-end gap-4">
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
						<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
						<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
					</div>

					<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportCustomers">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</div>

				<!-- Table  -->
				<UTable :data="rows" :columns="customer_columns" :loading="loading" @select="selectCustomer">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No customers found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
						</div>
					</template>
				</UTable>

				<div v-if="customers.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_customers" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { customer_columns } from '~/utils/table-columns';
import type { Customer } from '~/utils/types/customer';
import type { TableRow } from '@nuxt/ui';

useHead({ title: 'Wemotoo CRM - Customers' });

const customerStore = useCustomerStore();
const { loading, customers, filter, total_customers, exporting } = storeToRefs(customerStore);

const rows = computed(() => {
	return customers.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const selectCustomer = async (e: Event, row: TableRow<Customer>) => {
	const customer = row.original;
	if (!customer) return;

	navigateTo(`/customers/detail/${encodeURIComponent(customer.customer_no)}`);
};

const updatePage = async (page: number) => {
	await customerStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await customerStore.updatePageSize(size);
};

const exportCustomers = async () => {
	await customerStore.exportCustomers();
};
</script>

<style scoped></style>
