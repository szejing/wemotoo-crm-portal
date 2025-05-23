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

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No Categories Found</h2>
									<p>Create a new category to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="categories.length > 0" class="section-pagination">
							<UPagination v-model="page" :page-count="pageSize" :total="categories.length" />
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
		label: 'All Categories',
		icon: ICONS.LIST,
		to: '/categories',
	},
];

const modal = useModal();
const page = ref(1);
const categoryStore = useProductCategoryStore();
await categoryStore.getCategories();

const { loading, categories, pageSize } = storeToRefs(categoryStore);

const rows = computed(() => {
	return categories.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const selectCategory = async (category: Category) => {
	editCategory(category.code!);
};

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

const editCategory = async (code: string) => {
	const category: Category | undefined = categories.value.find((category) => category.code === code);
	if (!category) return;
	modal.open(ZModalCategoryDetail, {
		category: JSON.parse(JSON.stringify(category)),
		onUpdate: async ({ code, name, description, is_active, is_internal, parent_category, thumbnail, images }) => {
			await categoryStore.updateCategory(code, name, description, is_active, is_internal, parent_category, thumbnail, images);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
		onDelete: async () => {
			deleteCategory(code);
		},
	});
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
	@apply text-gray-400;
}
</style>
