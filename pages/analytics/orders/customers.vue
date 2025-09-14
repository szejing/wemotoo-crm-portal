<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterOrderSummCustomers />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<ZSelectMenuTableColumns :columns="order_summ_customer_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</template>

				<UTable :rows="tableData" :columns="columnsTable" :loading="is_loading">
					<template #customer-data="{ row: item }">
						<p>
							{{ item.customer_name }} <span class="text-gray-500">#{{ item.customer_no }}</span>
						</p>
					</template>

					<template #status-data="{ row: item }">
						<UBadge v-if="item.status == OrderStatus.NEW" variant="outline" color="green">NEW</UBadge>
						<UBadge v-else-if="item.status == OrderStatus.REFUNDED" variant="outline" color="main">REFUNDED</UBadge>
						<UBadge v-else-if="item.status == OrderStatus.CANCELLED" variant="outline" color="red">CANCELLED</UBadge>
					</template>

					<!-- <template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #gross_amt-data="{ row: item }">
						<p>{{ item.gross_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #net_amt-data="{ row: item }">
						<p>{{ item.net_amt.toFixed(2) }}</p>
					</template>

					<template #total_qty-data="{ row: item }">
						<p>{{ item.total_qty }}</p>
					</template>
				</UTable>

				<div v-if="order_summ_customer.data.length > 0" class="section-pagination">
					<UPagination
						v-model="current_page"
						:page-count="order_summ_customer.page_size"
						:total="order_summ_customer.total_data"
						@update:model-value="updatePage"
					/>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { OrderStatus } from 'wemotoo-common';
import { order_summ_customer_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Order Customer Summary',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/customers',
	},
];

onMounted(async () => {
	await orderSummStore.getOrderCustomerSummary();
});

const orderSummStore = useSummOrderStore();
const { order_summ_customer } = storeToRefs(orderSummStore);

const is_loading = computed(() => order_summ_customer.value.is_loading);
const tableData = computed(() => order_summ_customer.value.data);

const selectedColumns = ref(order_summ_customer_columns);
const columnsTable = computed(() => order_summ_customer_columns.filter((column) => selectedColumns.value.includes(column)));

const current_page = computed(() => order_summ_customer.value.current_page);

const updateColumns = (columns: { key: string; label: string }[]) => {
	selectedColumns.value = columns;
};

const updatePage = async (page: number) => {
	order_summ_customer.value.current_page = page;
	await orderSummStore.getOrderCustomerSummary();
};
</script>

<style scoped lang="postcss"></style>
