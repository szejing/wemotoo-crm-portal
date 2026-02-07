<template>
	<UDashboardPanel id="payment-methods">
		<template #header>
			<UDashboardNavbar :title="$t('nav.paymentMethods')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterPaymentMethods />
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
					@export="exportPaymentMethods"
				/>

				<!-- Table -->
				<UTable :data="rows" :columns="payment_method_columns" :loading="loading">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.PAYMENT_METHODS" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noPaymentMethodsFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<div v-if="payment_methods.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_payment_methods" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalLoading } from '#components';
import { options_page_size } from '~/utils/options';
import { getPaymentMethodColumns } from '~/utils/table-columns';

const { t } = useI18n();
const payment_method_columns = computed(() => getPaymentMethodColumns(t));
useHead({ title: () => t('pages.paymentMethodsTitle') });

onMounted(() => paymentMethodStore.getPaymentMethods());

const overlay = useOverlay();
const paymentMethodStore = usePaymentMethodStore();
const { payment_methods, filter, total_payment_methods, loading, exporting, updating } = storeToRefs(paymentMethodStore);
const loadingModal = overlay.create(ZModalLoading, { props: { key: 'loading' } });

watch(
	() => updating.value,
	(value: boolean) => {
		if (value) {
			loadingModal.open();
		} else {
			loadingModal.close();
		}
	},
);

const rows = computed(() => {
	return payment_methods.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const updatePage = async (page: number) => {
	await paymentMethodStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await paymentMethodStore.updatePageSize(size);
};

const exportPaymentMethods = async () => {
	await paymentMethodStore.exportPaymentMethods();
};
</script>

<style scoped></style>
