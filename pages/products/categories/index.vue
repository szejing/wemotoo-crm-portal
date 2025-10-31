<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Category</h2>
					<FormProductCategoryCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<ZSectionFilterCategories />

					<div class="mt-4">
						<!-- Table  -->
						<UTable :data="rows" :columns="category_columns" :loading="loading" @select-row="selectCategory" />

						<!-- Pagination  -->
						<div v-if="categories.length > 0" class="section-pagination">
							<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_categories" @update:page="updatePage" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalCategoryDetail, ZModalConfirmation } from '#components';
import { category_columns } from '~/utils/table-columns';
import type { Category } from '~/utils/types/category';

const links = [
	{
		label: 'Products',
		icon: ICONS.LIST,
		to: '/products',
	},
	{
		label: 'All Categories',
		icon: ICONS.CATEGORY,
		to: '/products/categories',
	},
];

useHead({ title: 'Wemotoo CRM - Categories' });

const overlay = useOverlay();
const categoryStore = useProductCategoryStore();
await categoryStore.getCategories();

const { loading, categories, total_categories, page_size, current_page } = storeToRefs(categoryStore);

const rows = computed(() => {
	return categories.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const deleteCategory = async (code: string) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this category?',
			action: 'delete',
			onConfirm: async () => {
				await categoryStore.deleteCategory(code);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectCategory = async (category: Category) => {
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
				await deleteCategory(category.code);
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
</script>

<style scoped>
.base {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1rem;
}

@media (min-width: 640px) {
	.base {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
}

.section-empty {
	height: 13rem;
}

.section-empty div {
	text-align: center;
}

.section-empty h2 {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 600;
}

.section-empty p {
	color: var(--color-neutral-400);
}
</style>
