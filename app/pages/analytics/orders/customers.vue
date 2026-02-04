<template>
	<UDashboardPanel id="analytics-orders-customers">
		<template #header>
			<UDashboardNavbar :title="$t('pages.analyticsOrdersCustomers')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterOrderSummCustomers />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
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
						:page-size-options="options_page_size"
						:export-enabled="true"
						:exporting="order_summ_customer.exporting"
						@update:model-value="updatePageSize"
						@export="exportOrderCustomerSummaryToCsv"
					/>

					<!-- Table -->
					<UTable :data="data" :columns="order_summ_customer_columns" :loading="is_loading" class="mt-4">
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
					<UPagination
						v-model="current_page"
						:items-per-page="order_summ_customer.page_size"
						:total="order_summ_customer.total_data"
						@update:page="updatePage"
					/>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { getOrderSummCustomerColumns } from '~/utils/table-columns';
import { options_page_size } from '~/utils/options';

const { t } = useI18n();
const order_summ_customer_columns = computed(() => getOrderSummCustomerColumns(t));
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

<style scoped></style>
