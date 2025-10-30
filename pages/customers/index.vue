<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
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
					<template #phone_number-data="{ row }">
						<h5 class="text-neutral-500">(+{{ row.dial_code }}) {{ row.phone_no }}</h5>
					</template>

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
					<UPagination v-model="current_page" :page-count="page_size" :total="total_customers" @update:model-value="updatePage" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { customer_columns } from '~/utils/table-columns';
import type { Customer } from '~/utils/types/customer';

const links = [
	{
		label: 'Customers',
		icon: ICONS.CUSTOMER_GROUP_ROUNDED,
		to: '/',
	},
];

const overlay = useOverlay();
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
