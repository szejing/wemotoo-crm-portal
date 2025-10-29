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
						<UTable :rows="rows" :columns="category_columns" :loading="loading" @select="selectCategory">
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

const modal = useModal();
const categoryStore = useProductCategoryStore();
await categoryStore.getCategories();

const { loading, categories, total_categories, page_size, current_page } = storeToRefs(categoryStore);

const rows = computed(() => {
	return categories.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const deleteCategory = async (code: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this category?',
		action: 'delete',
		onConfirm: async () => {
			await categoryStore.deleteCategory(code);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectCategory = async (category: Category) => {
	if (!category) return;
	modal.open(ZModalCategoryDetail, {
		category: JSON.parse(JSON.stringify(category)),
		onUpdate: async ({ code, description, is_active, is_internal, parent_category, thumbnail, images }) => {
			await categoryStore.updateCategory(code, description, is_active, is_internal, parent_category, thumbnail, images);
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteCategory(category.code);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const updatePage = async (page: number) => {
	await categoryStore.updatePage(page);
};
</script>

<style scoped lang="postcss">
.base {
	@apply container grid grid-cols-1 sm:grid-cols-6 gap-6 mt-4;
}

.section-empty {
	@apply h-52;
}

.section-empty div {
	@apply text-center;
}

.section-empty h2 {
	@apply text-2xl font-semibold;
}

.section-empty p {
	@apply text-neutral-400;
}
</style>
