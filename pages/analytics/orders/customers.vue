<template>
	<UDashboardPanel id="analytics-orders-customers">
		<template #header>
			<UDashboardNavbar title="Analytics Orders Customers" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZSectionFilterOrderSummCustomers />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<!-- <ZSelectMenuTableColumns :columns="order_summ_customer_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" /> -->

						<UButton :disabled="order_summ_customer.exporting" :loading="order_summ_customer.exporting" @click="exportOrderCustomerSummaryToCsv">
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>
					</div>
				</template>

				<UTable :data="data" :columns="order_summ_customer_columns" :loading="is_loading" />

				<div v-if="order_summ_customer.data.length > 0" class="section-pagination">
					<UPagination
						:default-page="current_page"
						:items-per-page="order_summ_customer.page_size"
						:total="order_summ_customer.total_data"
						@update:page="updatePage"
					/>
				</div>
			</UCard>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { order_summ_customer_columns } from '~/utils/table-columns';

useHead({ title: 'Wemotoo CRM - Order Customer Summary' });

onMounted(async () => {
	await orderSummStore.getOrderCustomerSummary();
});

const orderSummStore = useSummOrderStore();
const { order_summ_customer } = storeToRefs(orderSummStore);

const is_loading = computed(() => order_summ_customer.value.is_loading);
const data = computed(() => order_summ_customer.value.data);

// const selectedColumns = ref(order_summ_customer_columns);
// const columnsTable = computed(() => order_summ_customer_columns.filter((column) => selectedColumns.value.includes(column)));

const current_page = computed(() => order_summ_customer.value.current_page);

// const updateColumns = (columns: { key: string; label: string }[]) => {
// 	selectedColumns.value = columns;
// };

const updatePage = async (page: number) => {
	order_summ_customer.value.current_page = page;
	await orderSummStore.getOrderCustomerSummary();
};

const exportOrderCustomerSummaryToCsv = async () => {
	await orderSummStore.exportOrderCustomerSummary();
};
</script>

<style scoped></style>
