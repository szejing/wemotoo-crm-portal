<template>
	<UDashboardPanel id="products-categories">
		<template #header>
			<UDashboardNavbar :title="$t('nav.categories')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
				<template #right>
					<ZCreateButton to="/products/categories/create" />
				</template>
			</UDashboardNavbar>
			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterCategories />
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
					@export="exportCategories"
				/>

				<!-- Table  -->
				<UTable :data="categories" :columns="category_columns" :loading="loading" @select="selectCategory">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.ADDITIONAL" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noCategoriesFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="categories.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_categories" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalCategoryDetail, ZModalConfirmation } from '#components';
import { getCategoryColumns } from '~/utils/table-columns';
import type { Category } from '~/utils/types/category';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';

const { t } = useI18n();
const category_columns = computed(() => getCategoryColumns(t));
useHead({ title: () => t('pages.categoriesTitle') });

const overlay = useOverlay();
const categoryStore = useProductCategoryStore();
const { loading, categories, total_categories, filter, exporting } = storeToRefs(categoryStore);

// Defer initial fetch to client so Pinia is active (avoids "getActivePinia() was called but there was no active Pinia" on refresh)
onMounted(() => {
	categoryStore.getCategories();
});

const deleteCategory = async (row: TableRow<Category>) => {
	const category = row.original;

	const hasProducts = category.total_products && category.total_products > 0;

	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: hasProducts ? t('pages.confirmDeleteCategoryWithProducts') : t('pages.confirmDeleteCategory'),
			action: 'delete',
			onConfirm: async () => {
				await categoryStore.deleteCategory(category.code);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectCategory = async (e: Event, row: TableRow<Category>) => {
	const category = row.original;
	if (!category) return;
	const categoryModal = overlay.create(ZModalCategoryDetail, {
		props: {
			category: JSON.parse(JSON.stringify(category)),
			onUpdate: async ({ code, description, is_active, is_internal, parent_category, thumbnail, images }) => {
				await categoryStore.updateCategory(code, description, is_active, is_internal, parent_category, thumbnail, images);
				categoryModal.close();
			},
			onDelete: async () => {
				categoryModal.close();
				await deleteCategory(row);
			},
			onCancel: () => {
				categoryModal.close();
			},
		},
	});

	categoryModal.open();
};

const updatePage = async (page: number) => {
	await categoryStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await categoryStore.updatePageSize(size);
};

const exportCategories = async () => {
	// await categoryStore.exportCategories();
};
</script>

<style scoped></style>
