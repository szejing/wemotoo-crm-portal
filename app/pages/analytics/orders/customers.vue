<template>
	<ZPagePanel id="analytics-orders-customers" :title="$t('pages.analyticsOrdersCustomers')" back-to="/analytics/orders">
		<template #toolbar>
			<ZSectionFilterOrderSummCustomers />
		</template>

		<div class="space-y-6">
			<div v-if="!is_loading && data.length == 0">
				<div class="flex flex-col items-center justify-center py-6">
					<UIcon :name="ICONS.REPORT_ORDER" class="w-12 h-12 text-gray-400" />
					<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noDataFound') }}</p>
					<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
				</div>
			</div>

			<div v-else>
				<!-- Table Controls -->
				<ZTableToolbar
					v-model="order_summ_customer.page_size"
					v-model:selected-column-keys="selectedColumnKeys"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="order_summ_customer.exporting"
					:column-options="columnOptions"
					@update:model-value="updatePageSize"
					@export="exportOrderCustomerSummaryToCsv"
				/>

				<!-- Table -->
				<UTable :data="data" :columns="visibleColumns" :loading="is_loading" class="mt-4">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noDataFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>
			</div>

			<div v-if="order_summ_customer.data.length > 0" class="section-pagination">
				<UPagination v-model="current_page" :items-per-page="order_summ_customer.page_size" :total="order_summ_customer.total_data" @update:page="updatePage" />
			</div>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { getSummCustomerColumns, getSummCustomerColumnLabels } from '~/utils/table-columns';
import type { SummOrderCustomer } from '~/utils/types/summ-orders';
import { columnOptionsFromLabelMap } from '~/utils/table-columns/visibility';
import { options_page_size } from '~/utils/options';

const { t } = useI18n();
const summ_customer_columns = computed(() => getSummCustomerColumns<SummOrderCustomer>(t, 'order'));
const columnOptions = computed(() => columnOptionsFromLabelMap(t, getSummCustomerColumnLabels('order')));
const { selectedColumnKeys, visibleColumns } = useTableColumnVisibility(summ_customer_columns, columnOptions);
useHead({ title: () => t('pages.orderCustomerSummary') });

onMounted(async () => {
	await orderSummStore.getOrderCustomerSummary();
});

const orderSummStore = useSummOrderStore();
const { order_summ_customer } = storeToRefs(orderSummStore);

const is_loading = computed(() => order_summ_customer.value.loading);
const data = computed(() => order_summ_customer.value.data);
const current_page = computed(() => order_summ_customer.value.current_page);

const updatePage = async (page: number) => {
	order_summ_customer.value.current_page = page;
	await orderSummStore.getOrderCustomerSummary();
};

const updatePageSize = async (size: number) => {
	await orderSummStore.updateOrderCustomerSummPageSize(size);
};

const exportOrderCustomerSummaryToCsv = async () => {
	await orderSummStore.exportOrderCustomerSummary();
};
</script>

<style scoped>
/* `tr:last-child` would wrongly match the last tbody row; footer lives in tfoot */
:deep(tfoot tr) {
	background-color: rgb(249 250 251);
	border-top: 2px solid rgb(209 213 219);
}
</style>
