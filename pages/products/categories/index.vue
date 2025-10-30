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
						<UTable :data="rows" :columns="category_columns" :loading="loading" @select-row="selectCategory">
							<template #code-data="{ row }">
								<div class="flex flex-col-start sm:flex-row sm:justify-start sm:items-center gap-2">
									<NuxtImg v-if="row.thumbnail" :src="row.thumbnail?.url" class="w-15 h-15 rounded-sm" />
									<h5 class="font-bold text-secondary-800">{{ row.code }}</h5>
								</div>
							</template>

							<template #name-data="{ row }">
								<div>
									<h5 class="font-bold text-secondary-800">{{ row.name }}</h5>
								</div>
							</template>

							<template #total_items-header>
								<h5 class="text-center">No of Items</h5>
							</template>

							<template #total_items-data="{ row }">
								<h5 class="text-neutral-500 text-center">{{ row.total_products ?? 0 }}</h5>
							</template>

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No Categories Found</h2>
									<p>Create a new category to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="categories.length > 0" class="section-pagination">
							<UPagination v-model="current_page" :page-count="page_size" :total="total_categories" @update:model-value="updatePage" />
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
