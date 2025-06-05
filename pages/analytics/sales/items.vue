<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSummItems />
			<UCard class="mt-4">
				<template #header>
					<div class="flex-jend">
						<ZSelectMenuTableColumns :columns="sale_summ_item_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</template>

				<UTable :rows="rows" :columns="columnsTable" :loading="is_loading">
					<template #biz_date-data="{ row }">
						<p>{{ getFormattedDate(new Date(row.biz_date)) }}</p>
					</template>

					<template #currency_code-data="{ row }">
						<p>{{ row.currency_code }}</p>
					</template>

					<template #item_status-data="{ row }">
						<UBadge v-if="row.item_status == OrderItemStatus.ACTIVE" variant="outline" color="green">ACTIVE</UBadge>
						<UBadge v-if="row.item_status == OrderItemStatus.VOIDED" variant="outline" color="red">VOIDED</UBadge>
					</template>

					<template #prod-data="{ row }">
						<p>{{ row.prod_code }}</p>
						<p>{{ row.prod_name }}</p>
						<p>{{ row.prod_variant_code }}</p>
						<p>{{ row.prod_variant_name }}</p>
					</template>

					<template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #gross_amt-data="{ row }">
						<p>{{ row.gross_amt.toFixed(2) }}</p>
					</template>

					<template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #net_amt-data="{ row }">
						<p>{{ row.net_amt.toFixed(2) }}</p>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Data !</span>
						</div>
					</template>
				</UTable>

				<div v-if="data.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="data.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { getFormattedDate, OrderItemStatus } from 'wemotoo-common';
import { sale_summ_item_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Item Reports',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/items',
	},
];

const page = ref(1);
const pageSize = ref(10);
const salesSummStore = useSummSaleStore();
const { sale_summ_items } = storeToRefs(salesSummStore);

const currency_code = ref(sale_summ_items.value.filter.currency_code);

const is_loading = computed(() => sale_summ_items.value.is_loading);
const data = computed(() => sale_summ_items.value.data);
const selectedColumns = ref(sale_summ_item_columns);
const columnsTable = computed(() => sale_summ_item_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: { key: string; label: string }[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return data.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="postcss"></style>
