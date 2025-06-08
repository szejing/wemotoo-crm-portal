<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSummCustomers />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<ZSelectMenuTableColumns :columns="sale_summ_customer_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</template>

				<UTable :rows="tableData" :columns="columnsTable" :loading="is_loading">
					<template #customer-data="{ row: item }">
						<p>
							{{ item.customer_name }} <span class="text-gray-500">#{{ item.customer_no }}</span>
						</p>
					</template>

					<template #status-data="{ row: item }">
						<UBadge v-if="item.status == SaleStatus.COMPLETED" variant="outline" color="green">COMPLETED</UBadge>
						<UBadge v-else-if="item.status == SaleStatus.CANCELLED" variant="outline" color="red">CANCELLED</UBadge>
						<UBadge v-else-if="item.status == SaleStatus.REFUNDED" variant="outline" color="yellow">REFUNDED</UBadge>
					</template>

					<template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #gross_amt-data="{ row: item }">
						<p>{{ item.gross_amt.toFixed(2) }}</p>
					</template>

					<template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #net_amt-data="{ row: item }">
						<p>{{ item.net_amt.toFixed(2) }}</p>
					</template>

					<template #total_txns-data="{ row: item }">
						<p>{{ item.total_txns }}</p>
					</template>

					<template #total_qty-data="{ row: item }">
						<p>{{ item.total_qty }}</p>
					</template>
				</UTable>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SaleStatus } from 'wemotoo-common';
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

const saleSummStore = useSummSaleStore();
const { sale_summ_customer } = storeToRefs(saleSummStore);
const currency_code = ref(sale_summ_customer.value.filter.currency_code);

const is_loading = computed(() => sale_summ_customer.value.is_loading);
const tableData = computed(() => sale_summ_customer.value.data);

const selectedColumns = ref(sale_summ_customer_columns);
const columnsTable = computed(() => sale_summ_customer_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: { key: string; label: string }[]) => {
	selectedColumns.value = columns;
};
</script>

<style scoped lang="postcss"></style>
