<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h3>Add New Category</h3>
					<FormProductCategoryCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<ZSectionFilterCategories />

					<div v-if="productCategories.length > 0" class="mt-4">
						<!-- Table  -->
						<UTable :rows="rows" :columns="product_category_columns">
							<template #actions-data="{ row }">
								<ZActionDropdown :items="options(row)" />
							</template>
						</UTable>

						<!-- Pagination  -->
						<div class="section-pagination">
							<UPagination v-model="page" :page-count="pageSize" :total="productCategories.length" />
						</div>
					</div>

					<div v-else class="flex-center section-empty">
						<div>
							<h2>No Categories Found</h2>
							<p>Create a new category to get started</p>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useProductCategoriesStore } from '~/stores/ProductCategories/ProductCategories';
import { product_category_columns } from '~/utils/table-columns';
import type { ProductCategory } from '~/utils/types/product-category';

const links = [
	{
		label: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/products',
	},
	{
		label: 'All Categories',
		icon: 'i-material-symbols-light-lists-rounded',
		to: '/products/categories',
	},
];

const options = (row: ProductCategory) => [
	[
		{
			label: 'Edit',
			icon: 'i-heroicons-pencil-square-20-solid',
			click: () => console.log('Edit', row.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
			slot: 'danger',
			click: () => console.log('Delete', row.id),
		},
	],
];

const page = ref(1);
const productCategoriesStore = useProductCategoriesStore();

const { productCategories, pageSize } = storeToRefs(productCategoriesStore);

const rows = computed(() => {
	return productCategories.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
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
