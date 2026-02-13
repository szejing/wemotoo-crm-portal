<template>
	<UDashboardPanel id="products-brands">
		<template #header>
			<UDashboardNavbar :title="$t('nav.brands')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<ZCreateButton to="/products/brands/create" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterBrands />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<ZTableToolbar
					v-model="filter.page_size"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="exporting"
					@update:model-value="brandStore.updatePageSize"
					@export="exportBrands"
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
				<UTable v-else :data="brands" :columns="brand_columns" :loading="loading" @select="selectBrand">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.ADDITIONAL" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noBrandsFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="!initialize && brands.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_brands" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalBrandDetail, ZModalConfirmation } from '#components';
import { getBrandColumns } from '~/utils/table-columns';
import type { Brand } from '~/utils/types/brand';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';
import { failedNotification } from '~/stores/AppUi/AppUi';

const overlay = useOverlay();
const brandStore = useBrandStore();

const { t } = useI18n();
const brand_columns = computed(() => getBrandColumns(t));
useHead({ title: () => t('pages.brandsTitle') });

const { loading, brands, total_brands, filter, exporting } = storeToRefs(brandStore);
const initialize = ref(true);

onMounted(async () => {
	initialize.value = true;
	try {
		await brandStore.getBrands();
	} finally {
		initialize.value = false;
	}
});

const deleteBrand = async (row: TableRow<Brand>) => {
	const brand = row.original;

	const hasProducts = false;

	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: hasProducts ? t('pages.confirmDeleteBrandWithProducts') : t('pages.confirmDeleteBrand'),
			action: 'delete',
			onConfirm: async () => {
				await brandStore.deleteBrand(brand);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectBrand = async (e: Event, row: TableRow<Brand>) => {
	const brand = row.original;
	if (!brand) return;

	if (brand.is_internal) {
		failedNotification(t('pages.internalBrandsCannotBeEdited'));
		return;
	}

	const brandModal = overlay.create(ZModalBrandDetail, {
		props: {
			brand: JSON.parse(JSON.stringify(brand)),
			onUpdate: async ({ description, is_active }) => {
				await brandStore.updateBrand(description, is_active);
				brandModal.close();
			},
			onDelete: async () => {
				brandModal.close();
				await deleteBrand(row);
			},
			onCancel: () => {
				brandModal.close();
			},
		},
	});

	brandModal.open();
};

const updatePage = async (page: number) => {
	await brandStore.updatePage(page);
};

const exportBrands = async () => {
	// await brandStore.exportBrands();
};
</script>

<style scoped></style>
