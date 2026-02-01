<template>
	<UDashboardPanel id="payment-types">
		<template #header>
			<UDashboardNavbar title="Payment Types" :ui="{ right: 'gap-3' }">
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
				<div class="flex flex-row sm:items-center justify-between sm:justify-end gap-4">
					<!-- Page Size -->
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
						<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
						<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
					</div>

					<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportPaymentTypes">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</div>

				<!-- Table -->
				<UTable :data="rows" :columns="payment_type_group_columns" :loading="loading">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.PAYMENT_METHODS" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No payment types found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
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
import { payment_type_group_columns } from '~/utils/table-columns';

useHead({ title: 'Wemotoo CRM - Payment Types' });

onMounted(() => paymentTypeStore.getPaymentTypeGroups());

const paymentTypeStore = usePaymentTypeStore();
const { payment_type_groups, filter, total_payment_type_groups, loading, exporting } = storeToRefs(paymentTypeStore);

const rows = computed(() => {
	return payment_type_groups.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

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
