<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSummCustomers />
			<UCard class="mt-4">
				<template #header>
					<!-- <div class="flex-jend">
						<ZSelectMenuTableColumns :columns="sale_summ_customer_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div> -->
				</template>

				<UTable :data="data" :columns="sale_summ_customer_columns" :loading="is_loading" />

				<div v-if="sale_summ_customer.data.length > 0" class="section-pagination">
					<UPagination
						v-model="current_page"
						:page-count="sale_summ_customer.page_size"
						:total="sale_summ_customer.total_data"
						@update:model-value="updatePage"
					/>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { sale_summ_customer_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Customer Reports',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/customers',
	},
];

useHead({ title: 'Wemotoo CRM - Sale Customer Summary' });

onMounted(async () => {
	await saleSummStore.getSaleCustomerSummary();
});

const saleSummStore = useSummSaleStore();
const { sale_summ_customer } = storeToRefs(saleSummStore);

const is_loading = computed(() => sale_summ_customer.value.is_loading);
const data = computed(() => sale_summ_customer.value.data);

// const selectedColumns = ref(sale_summ_customer_columns);
// const columnsTable = computed(() => sale_summ_customer_columns.filter((column) => selectedColumns.value.includes(column)));

const current_page = computed(() => sale_summ_customer.value.current_page);

// const updateColumns = (columns: { key: string; label: string }[]) => {
// 	selectedColumns.value = columns;
// };

const updatePage = async (page: number) => {
	sale_summ_customer.value.current_page = page;
	await saleSummStore.getSaleCustomerSummary();
};
</script>

<style scoped></style>
