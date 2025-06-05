<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterCustomers />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>
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
				<UTable :rows="rows" :columns="customer_columns" :loading="loading" @select="selectCustomer">
					<template #phone_number-data="{ row }">
						<h5 class="text-neutral-500">(+{{ row.dial_code }}) {{ row.phone_no }}</h5>
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

const modal = useModal();
const page = ref(1);
const customerStore = useCustomerStore();

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const { loading, customers, pageSize } = storeToRefs(customerStore);

const rows = computed(() => {
	return customers.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const selectCustomer = async (customer: Customer) => {
	if (!customer) return;
};
</script>

<style scoped lang="postcss"></style>
