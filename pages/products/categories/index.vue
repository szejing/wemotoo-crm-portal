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
			click: () => console.log('Edit', row.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
			slot: 'danger',
			click: () => console.log('Delete', row.id),
		},
	],
];

const page = ref(1);
const productCategoriesStore = useProductCategoriesStore();
await productCategoriesStore.getCategories();

const { loading, productCategories, pageSize } = storeToRefs(productCategoriesStore);

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
