<template>
	<div>
		<UBreadcrumb :items="links" />
		<div class="container">
			<ZSectionFilterCustomers />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :items="options_page_size" /> </span>
					<div class="flex gap-4">
						<UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<UButton color="green">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>

				<!-- Table  -->
				<UTable :rows="rows" :columns="customer_columns">
					<template #actions-data="{ row }">
						<ZActionDropdown :items="options(row)" />
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No one here!</span>
							<UButton color="green">
								<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
								Create
							</UButton>
						</div>
					</template>
				</UTable>

				<div v-if="customers.length > 0" class="section-pagination">
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
		icon: ICONS.CUSTOMER_GROUP_ROUNDED,
		to: '/',
	},
];

const options = (row: Customer) => [
	[
		{
			label: 'Edit',
			icon: ICONS.PENCIL,
			click: () => console.log('Edit', row.customer_no),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
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

<style scoped lang="postcss"></style>
