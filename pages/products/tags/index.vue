<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Tag</h2>
					<FormProductTagCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<ZSectionFilterTags />
					<div v-if="productTags.length > 0">
						<!-- Table  -->
						<UTable :rows="rows" :columns="product_tag_columns">
							<template #actions-data="{ row }">
								<ZActionDropdown :items="options(row)" />
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="productTags.length == 0" class="section-pagination">
							<UPagination v-model="page" :page-count="pageSize" :total="productTags.length" />
						</div>
					</div>

					<div v-else class="flex-center h-52 section-empty">
						<div>
							<h2>No Tags Found</h2>
							<p>Create a new tag to get started</p>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useProductTagsStore } from '~/stores/ProductTags/ProductTags';
import { product_tag_columns } from '~/utils/table-columns';
import type { ProductTag } from '~/utils/types/product-tag';

const links = [
	{
		label: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/products',
	},
	{
		label: 'All Tags',
		icon: 'i-material-symbols-light-lists-rounded',
		to: '/tags',
	},
];

const options = (row: ProductTag) => [
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
const productTagsStore = useProductTagsStore();
await productTagsStore.getTags();

const { productTags, pageSize } = storeToRefs(productTagsStore);

const rows = computed(() => {
	return productTags.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
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
