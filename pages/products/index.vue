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
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<UButton color="green" @click="navigateTo('/products/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>
				<UTable :rows="rows" :columns="product_columns">
					<template #orig_sell_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">{{ price.currency_code }} {{ price.orig_sell_price }}</p>
					</template>

					<template #sale_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">{{ price.currency_code }} {{ price.sale_price }}</p>
					</template>

					<template #code-data="{ row }">
						<p class="font-bold">
							{{ row.code }}
						</p>
					</template>

					<template #name-data="{ row }">
						<p class="font-bold">
							{{ row.name }}
						</p>
					</template>

					<template #actions-data="{ row }">
						<ZActionDropdown :items="options(row)" />
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Products !</span>

							<UButton color="green" @click="navigateTo('/products/create')">
								<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
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
import { ZModalConfirmation, ZModalProductDetail } from '#components';
import { useProductStore } from '~/stores/Products/Products';
import { options_page_size } from '~/utils/options';
import { product_columns } from '~/utils/table-columns';
import type { Product } from '~/utils/types/product';

const links = [
	{
		label: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
	},
	{
		label: 'All Products',
		icon: ICONS.LIST,
		to: '/products',
	},
];

const options = (product: Product) => [
	[
		{
			label: 'Edit',
			icon: ICONS.PENCIL,
			click: () => editProduct(product.code!),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
			slot: 'danger',
			click: () => deleteProduct(product.code!),
		},
	],
];

const modal = useModal();
const page = ref(1);
const productStore = useProductStore();

const { products, pageSize } = storeToRefs(productStore);

const rows = computed(() => {
	return products.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const deleteProduct = async (code: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this product ?',
		action: 'delete',
		onConfirm: async () => {
			await productStore.deleteProduct(code);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const editProduct = async (code: string) => {
	const product: Product | undefined = products.value.find((prod) => prod.code === code);
	if (!product) return;

	modal.open(ZModalProductDetail, {
		product: JSON.parse(JSON.stringify(product)),
		onUpdate: async (prod: Product) => {
			await productStore.updateProduct(code, prod);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};
</script>

<style scoped lang="css"></style>
