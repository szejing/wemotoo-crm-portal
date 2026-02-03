<template>
	<UDashboardPanel id="customers">
		<template #header>
			<UDashboardNavbar :title="$t('nav.customers')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
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
				<ZTableToolbar
					v-model="filter.page_size"
					:page-size-options="options_page_size"
					:export-enabled="false"
					:exporting="customerStore.exporting"
					@update:model-value="updatePageSize"
					@export="exportCustomers"
				/>

				<!-- Table  -->
				<UTable :data="rows" :columns="customer_columns" :loading="loading" @select="selectCustomer">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noCustomersFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
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
import { getCustomerColumns } from '~/utils/table-columns';
import type { Customer } from '~/utils/types/customer';
import type { TableRow } from '@nuxt/ui';

const { t } = useI18n();
const customer_columns = computed(() => getCustomerColumns(t));
useHead({ title: () => t('pages.customersTitle') });

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
