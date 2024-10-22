<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterProducts />
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>

					<div class="flex gap-4">
						<UButton>
							<UIcon name="i-ri-file-excel-2-line" class="size-5" />
							Export
						</UButton>

						<UButton color="green" @click="navigateTo('/products/create')">
							<UIcon name="i-ic-round-add-circle-outline" class="size-5" />
							Create
						</UButton>
					</div>
				</div>
				<UTable :rows="rows" :columns="product_columns">
					<template #actions-data="{ row }">
						<UDropdown :items="options(row)">
							<UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
						</UDropdown>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Products !</span>

							<UButton color="green" @click="navigateTo('/products/create')">
								<UIcon name="i-ic-round-add-circle-outline" class="size-5" />
								Create
							</UButton>
						</div>
					</template>
				</UTable>

				<div v-if="products.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="products.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useProductStore } from '~/stores/Products/Products';
import { options_page_size } from '~/utils/options';
import { product_columns } from '~/utils/table-columns';
import type { Product } from '~/utils/types/product';

const links = [
	{
		label: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/products',
	},
	{
		label: 'All Products',
		icon: 'i-material-symbols-light-lists-rounded',
		to: '/products',
	},
];

const options = (product: Product) => [
	[
		{
			label: 'Edit',
			icon: 'i-heroicons-pencil-square-20-solid',
			click: () => console.log('Edit', product.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
			slot: 'danger',
			click: () => console.log('Delete', product.id),
		},
	],
];

const page = ref(1);
const productStore = useProductStore();

const { products, pageSize } = storeToRefs(productStore);

const rows = computed(() => {
	return products.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="css"></style>
