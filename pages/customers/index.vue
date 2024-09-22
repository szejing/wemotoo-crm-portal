<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterCustomers />

			<UCard class="mt-4">
				<div class="x-4">
					<div class="flex justify-between">
						<span class="flex text-md font-nunito text-neutral-400 items-center gap-4">
							Show :<USelect v-model="pageSize" :options="options_page_size" />
						</span>

						<div class="flex gap-4">
							<UButton class="w-28 h-10" block>
								<UIcon name="i-ri-file-excel-2-line" class="w-5 h-5" />
								Export
							</UButton>

							<UButton class="w-42 h-10" block color="green">
								<UIcon name="i-ic-round-add-circle-outline" class="w-5 h-5" />
								Create Customer
							</UButton>
						</div>
					</div>
				</div>

				<!-- Table  -->
				<UTable :rows="rows" :columns="customer_columns">
					<template #actions-data="{ row }">
						<UDropdown :items="options(row)">
							<UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
						</UDropdown>
					</template>
				</UTable>

				<div class="flex justify-end px-3 py-3.5 border-t border-gray-200">
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

const links = [
	{
		label: 'Customers',
		icon: 'i-material-symbols-light-groups-outline-rounded',
		to: '/',
	},
];

const options = (row: any) => [
	[
		{
			label: 'Edit',
			icon: 'i-heroicons-pencil-square-20-solid',
			click: () => console.log('Edit', row.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
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
