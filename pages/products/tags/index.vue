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
								<ZActionDropdown :items="options(row)" />
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
import { ZModalConfirmation, ZModalTagDetail } from '#components';
import { useProductTagsStore } from '~/stores/ProductTags/ProductTags';
import { product_tag_columns } from '~/utils/table-columns';
import type { ProductTag } from '~/utils/types/product-tag';

const links = [
	{
		label: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
	},
	{
		label: 'All Tags',
		icon: ICONS.LIST,
		to: '/products/tags',
	},
];

const options = (row: ProductTag) => [
	[
		{
			label: 'Edit',
			icon: ICONS.PENCIL,
			click: async () => await editProductTag(row.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
			slot: 'danger',
			click: () => deleteProductTag(row.id),
		},
	],
];

const modal = useModal();
const page = ref(1);
const productTagsStore = useProductTagsStore();
await productTagsStore.getTags();

const { loading, productTags, pageSize } = storeToRefs(productTagsStore);

const rows = computed(() => {
	return productTags.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const deleteProductTag = async (id: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this tag?',
		action: 'delete',
		onConfirm: async () => {
			await productTagsStore.deleteProductTag(id);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const editProductTag = async (id: string) => {
	const tag: ProductTag | undefined = productTags.value.find((tag) => tag.id === id);

	if (!tag) return;

	modal.open(ZModalTagDetail, {
		productTag: JSON.parse(JSON.stringify(tag)),
		onUpdate: async (tag: ProductTag) => {
			await productTagsStore.updateProductTag(id, tag);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
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
