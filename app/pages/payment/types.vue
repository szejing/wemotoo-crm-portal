<template>
	<UDashboardPanel id="payment-types">
		<template #header>
			<UDashboardNavbar :title="$t('nav.paymentTypes')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterPaymentTypeGroups />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table Controls -->
				<ZTableToolbar
					v-model="filter.page_size"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="exporting"
					@update:model-value="updatePageSize"
					@export="exportPaymentTypes"
				/>

				<!-- Table -->
				<UTable :data="payment_type_groups" :columns="payment_type_group_columns" :loading="loading">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.PAYMENT_METHODS" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noPaymentTypesFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<div v-if="payment_type_groups.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_payment_type_groups" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { getPaymentTypeGroupColumns } from '~/utils/table-columns';

const { t } = useI18n();
const payment_type_group_columns = computed(() => getPaymentTypeGroupColumns(t));
useHead({ title: () => t('pages.paymentTypesTitle') });

onMounted(() => paymentTypeStore.getPaymentTypeGroups());

const paymentTypeStore = usePaymentTypeStore();
const { payment_type_groups, filter, total_payment_type_groups, loading, exporting } = storeToRefs(paymentTypeStore);

const updatePage = async (page: number) => {
	await paymentTypeStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await paymentTypeStore.updatePageSize(size);
};

const exportPaymentTypes = async () => {
	await paymentTypeStore.exportPaymentTypeGroups();
};
</script>

<style scoped></style>
