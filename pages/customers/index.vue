<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterCustomers />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>

					<div class="flex gap-4">
						<UButton>
							<UIcon name="i-ri-file-excel-2-line" class="size-5" />
							Export
						</UButton>

						<UButton color="green">
							<UIcon name="i-ic-round-add-circle-outline" class="size-5" />
							Create Customer
						</UButton>
					</div>
				</div>

				<!-- Table  -->
				<UTable :rows="rows" :columns="customer_columns">
					<template #actions-data="{ row }">
						<ZActionDropdown :items="options(row)" />
					</template>
				</UTable>

				<div class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="customers.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCustomersStore } from '~/stores/Customers/Customers';
import { options_page_size } from '~/utils/options';
import { customer_columns } from '~/utils/table-columns';
import type { Customer } from '~/utils/types/customer';

const links = [
	{
		label: 'Customers',
		icon: 'i-material-symbols-light-groups-outline-rounded',
		to: '/',
	},
];

const options = (row: Customer) => [
	[
		{
			label: 'Edit',
			icon: 'i-heroicons-pencil-square-20-solid',
			click: () => console.log('Edit', row.customer_no),
		},
	],
	[
		{
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
			slot: 'danger',
			click: () => console.log('Delete', row.customer_no),
		},
	],
];

const page = ref(1);
const customerStore = useCustomersStore();

const { customers, pageSize } = storeToRefs(customerStore);

const rows = computed(() => {
	return customers.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="css"></style>
