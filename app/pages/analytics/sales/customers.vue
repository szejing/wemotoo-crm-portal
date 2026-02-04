<template>
	<UDashboardPanel id="analytics-sales-customers">
		<template #header>
			<UDashboardNavbar :title="$t('pages.analyticsSalesCustomers')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterSaleSummCustomers />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<div v-if="!loading && data.length == 0">
					<div class="flex flex-col items-center justify-center py-6">
						<UIcon :name="ICONS.REPORT_SALES" class="w-12 h-12 text-gray-400" />
						<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noSalesCustomerSummaryFound') }}</p>
						<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
					</div>
				</div>

				<div v-else>
					<!-- Table Controls -->
					<ZTableToolbar
						v-model="sale_summ_customer.page_size"
						:page-size-options="options_page_size"
						:export-enabled="true"
						:exporting="sale_summ_customer.exporting"
						@update:model-value="updatePageSize"
						@export="saleSummStore.exportSaleCustomerSummary"
					/>

					<UTable :data="data" :columns="sale_summ_customer_columns" :loading="loading" class="mt-4">
						<template #empty>
							<div class="flex flex-col items-center justify-center py-6">
								<UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400" />
								<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noSalesCustomerSummaryFound') }}</p>
								<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
							</div>
						</template>
					</UTable>
				</div>

				<div v-if="sale_summ_customer.data.length > 0" class="section-pagination">
					<UPagination v-model="current_page" :items-per-page="sale_summ_customer.page_size" :total="sale_summ_customer.total_data" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { getSaleSummCustomerColumns } from '~/utils/table-columns';
import { options_page_size } from '~/utils/options';

const { t } = useI18n();
const sale_summ_customer_columns = computed(() => getSaleSummCustomerColumns(t));
useHead({ title: () => t('pages.saleCustomerSummary') });

onMounted(async () => {
	await saleSummStore.getSaleCustomerSummary();
});

const saleSummStore = useSummSaleStore();
const { sale_summ_customer, loading } = storeToRefs(saleSummStore);
const data = computed(() => sale_summ_customer.value.data);
const current_page = computed(() => sale_summ_customer.value.current_page);

const updatePage = async (page: number) => {
	sale_summ_customer.value.current_page = page;
	await saleSummStore.getSaleCustomerSummary();
};

const updatePageSize = async (size: number) => {
	sale_summ_customer.value.page_size = size;

	if (sale_summ_customer.value.page_size > sale_summ_customer.value.total_data) {
		sale_summ_customer.value.current_page = 1;
		return;
	}

	await saleSummStore.getSaleCustomerSummary();
};
</script>

<style scoped></style>
