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
						<UTable :rows="rows" :columns="product_category_columns" :loading="loading">
							<template #actions-data="{ row }">
								<ZActionDropdown :items="options(row)" />
							</template>

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No Categories Found</h2>
									<p>Create a new category to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="productCategories.length > 0" class="section-pagination">
							<UPagination v-model="page" :page-count="pageSize" :total="productCategories.length" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation } from '#components';
import { useProductCategoriesStore } from '~/stores/ProductCategories/ProductCategories';
import { product_category_columns } from '~/utils/table-columns';
import type { ProductCategory } from '~/utils/types/product-category';

const links = [
	{
		label: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
	},
	{
		label: 'All Categories',
		icon: ICONS.LIST,
		to: '/products/categories',
	},
];

const options = (row: ProductCategory) => [
	[
		{
			label: 'Edit',
			icon: ICONS.PENCIL,
			click: async () => await editProductCategory(row.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
			slot: 'danger',
			click: () => deleteProductCategory(row.id),
		},
	],
];

const modal = useModal();
const page = ref(1);
const categoryStore = useProductCategoriesStore();
await categoryStore.getCategories();

const { loading, productCategories, pageSize } = storeToRefs(categoryStore);

const rows = computed(() => {
	return productCategories.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const deleteProductCategory = async (id: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this tag?',
		action: 'delete',
		onConfirm: async () => {
			await categoryStore.deleteProductCategory(id);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const editProductCategory = async (id: string) => {
	console.log(id);
	// const category: ProductCategory | undefined = productCategories.value.find((category) => category.id === id);
	// if (!category) return;
	// modal.open(ZModalTagDetail, {
	// 	category: JSON.parse(JSON.stringify(category)),
	// 	onUpdate: async (category: ProductCategorie) => {
	// 		await categoryStore.updateProductTag(id, category);
	// 		modal.close();
	// 	},
	// 	onCancel: () => {
	// 		modal.close();
	// 	},
	// });
};
</script>

<style scoped lang="css">
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
