<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<ZSectionFilterTags />
				<UCard class="mt-4"> </UCard>
			</div>
			<UCard>
				<!-- Table  -->
				<UTable :rows="rows" :columns="product_tag_columns">
					<template #actions-data="{ row }">
						<UDropdown :items="options(row)">
							<UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
						</UDropdown>
					</template>
				</UTable>

				<div class="flex justify-end px-3 py-3.5 border-t border-gray-200">
					<UPagination v-model="page" :page-count="pageSize" :total="productTags.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useProductTagsStore } from '~/stores/ProductTags/ProductTags';
import { product_tag_columns } from '~/utils/table-columns';

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

const options = (row: any) => [
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
		},
	],
];

const page = ref(1);
const productTagsStore = useProductTagsStore();

const { productTags, pageSize } = storeToRefs(productTagsStore);

const rows = computed(() => {
	return productTags.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="css"></style>
