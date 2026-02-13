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

				<template v-if="initialize">
					<div class="rounded-lg overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
						<div class="grid grid-cols-[1fr_auto] gap-4 p-4">
							<USkeleton class="h-4 w-24" />
							<USkeleton class="h-4 w-16" />
						</div>
						<div v-for="i in 5" :key="i" class="grid grid-cols-[1fr_auto] gap-4 p-4 items-center">
							<USkeleton class="h-4 w-40" />
							<USkeleton class="h-4 w-12" />
						</div>
					</div>
				</template>
				<UTable v-else :data="payment_methods" :columns="payment_method_columns" :loading="loading">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.PAYMENT_METHODS" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noPaymentMethodsFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<div v-if="!initialize && payment_methods.length > 0" class="section-pagination">
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

const overlay = useOverlay();
const paymentMethodStore = usePaymentMethodStore();
const { payment_methods, filter, total_payment_methods, loading, exporting, updating } = storeToRefs(paymentMethodStore);
const initialize = ref(true);

onMounted(async () => {
	initialize.value = true;
	try {
		await paymentMethodStore.getPaymentMethods();
	} finally {
		initialize.value = false;
	}
});
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
