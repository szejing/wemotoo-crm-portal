<template>
	<UDashboardPanel id="customers">
		<template #header>
			<UDashboardNavbar title="Customers" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZSectionFilterCustomers />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="page_size" :items="options_page_size" /> </span>
					<div class="flex gap-4">
						<UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<UButton color="success">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>

				<!-- Table  -->
				<UTable :data="rows" :columns="customer_columns" :loading="loading" @select-row="selectCustomer">
					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No one here!</span>
							<UButton color="success">
								<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
								Create
							</UButton>
						</div>
					</template>
				</UTable>

				<div v-if="customers.length > 0" class="section-pagination">
					<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_customers" @update:page="updatePage" />
				</div>
			</UCard>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { customer_columns } from '~/utils/table-columns';
import type { Customer } from '~/utils/types/customer';

const customerStore = useCustomerStore();

useHead({ title: 'Wemotoo CRM - Customers' });

const { loading, customers, page_size, current_page, total_customers } = storeToRefs(customerStore);

const rows = computed(() => {
	return customers.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const selectCustomer = async (customer: Customer) => {
	if (!customer) return;
};

const updatePage = async (page: number) => {
	await customerStore.updatePage(page);
};
</script>

<style scoped></style>
