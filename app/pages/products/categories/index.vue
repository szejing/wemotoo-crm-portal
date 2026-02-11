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

				<!-- Tree table (WooCommerce-style hierarchy) -->
				<UTable
					v-model:expanded="expanded"
					:data="categories"
					:columns="category_tree_columns"
					:get-row-id="(row) => row.code"
					:get-sub-rows="getSubRows"
					:loading="loading"
					:ui="{
						base: 'border-separate border-spacing-0',
						tbody: '[&>tr]:last:[&>td]:border-b-0',
						tr: 'group data-[expanded=true]:bg-elevated/50',
						td: 'empty:p-0 group-has-[td:not(:empty)]:border-b border-default group-data-[expanded=true]:first:border-l-2 group-data-[expanded=true]:first:border-l-primary-400',
					}"
					@select="selectCategory"
				>
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.ADDITIONAL" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noCategoriesFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<!-- Count (tree view shows all categories) -->
				<div v-if="categories.length > 0" class="section-pagination text-sm text-muted">
					{{ $t('pages.categoriesCount', { total: total_categories }) }}
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalCategoryDetail, ZModalConfirmation } from '#components';
import { getCategoryTreeColumns } from '~/utils/table-columns';
import type { Category } from '~/utils/types/category';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';
import { failedNotification } from '~/stores/AppUi/AppUi';

const { t } = useI18n();
const category_tree_columns = computed(() => getCategoryTreeColumns(t));
useHead({ title: () => t('pages.categoriesTitle') });

const overlay = useOverlay();
const categoryStore = useProductCategoryStore();
const { loading, categories, total_categories, filter, exporting } = storeToRefs(categoryStore);

/** Expand only root (1st level) categories by default. */
const expanded = ref<Record<string, boolean>>({});

/** Return sub-rows from API's category_children so the table can expand. */
function getSubRows(row: Category): Category[] | undefined {
	const children = row.category_children;
	return children?.length ? children : undefined;
}

/** After data loads, expand all root categories that have children. */
function expandRootCategories() {
	const map: Record<string, boolean> = {};
	for (const cat of categories.value) {
		if (cat.category_children?.length) {
			map[cat.code] = true;
		}
	}
	expanded.value = map;
}

// Defer initial fetch to client so Pinia is active (avoids "getActivePinia() was called but there was no active Pinia" on refresh)
onMounted(async () => {
	await categoryStore.getCategoriesForTree();
	expandRootCategories();
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
				await categoryStore.getCategoriesForTree();
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

	if (category.is_internal) {
		failedNotification('Internal categories cannot be edited');
		return;
	}

	const categoryModal = overlay.create(ZModalCategoryDetail, {
		props: {
			category: JSON.parse(JSON.stringify(category)),
			onUpdate: async ({ code, description, is_active, is_internal, parent_category, thumbnail, images }) => {
				await categoryStore.updateCategory(code, description, is_active, is_internal, parent_category, thumbnail, images);
				await categoryStore.getCategoriesForTree();
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

const updatePageSize = async (size: number) => {
	categoryStore.filter.page_size = size;
	await categoryStore.getCategoriesForTree();
};

const exportCategories = async () => {
	// await categoryStore.exportCategories();
};
</script>

<style scoped></style>
