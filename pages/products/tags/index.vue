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
					<div>
						<!-- Table  -->
						<UTable :rows="rows" :columns="product_tag_columns" :loading="loading">
							<template #actions-data="{ row }">
								<UIcon :name="ICONS.TRASH" class="size-5 text-red-600" @click="deleteProductTag(row.id)" />
							</template>

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No Tags Found</h2>
									<p>Create a new tag to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="productTags.length > 0" class="section-pagination">
							<UPagination v-model="page" :page-count="pageSize" :total="productTags.length" />
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

const links = [
	{
		label: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
	},
	{
		label: 'All Tags',
		icon: ICONS.LIST,
		to: '/tags',
	},
];

const page = ref(1);
const productTagsStore = useProductTagsStore();
await productTagsStore.getTags();

const { loading, productTags, pageSize } = storeToRefs(productTagsStore);

const rows = computed(() => {
	return productTags.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const deleteProductTag = async (id: string) => {
	await productTagsStore.deleteProductTag(id);
};

// const editProductTag = async (id: string) => {
// 	console.log(id);
// 	// await productTagsStore.deleteProductTag(id);
// };
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
