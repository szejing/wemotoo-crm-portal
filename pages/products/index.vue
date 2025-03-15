<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterProducts />
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>

					<div class="flex gap-4">
						<!-- <UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton> -->

						<UButton color="green" @click="navigateTo('/products/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>
				<UTable :rows="rows" :columns="product_columns">
					<template #orig_sell_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">{{ price.currency_code }} {{ price.orig_sell_price.toFixed(2) }}</p>
					</template>

					<template #sale_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">
							<span v-if="price.sale_price != undefined && price.sale_price > 0">{{ price.currency_code }} {{ price.sale_price.toFixed(2) }}</span>
							<span v-else> - </span>
						</p>
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
import { options_page_size } from '~/utils/options';
import { product_columns } from '~/utils/table-columns';
import type { ProdOptionInput, Product, ProdVariantInput } from '~/utils/types/product';
import type { PriceInput } from '~/utils/types/price';
import type { CategoryInput } from '~/utils/types/category';
import type { TagInput } from '~/utils/types/tag';

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
			const { code, name, short_desc, long_desc, is_active, price_types, categories, tags, status, galleries, thumbnail, options, variants } = prod;

			// price_types
			const prodPrice: PriceInput[] = [];
			price_types?.forEach((price) => {
				prodPrice.push({
					id: price.id,
					orig_sell_price: price.orig_sell_price,
					cost_price: price.cost_price,
					sale_price: price.sale_price,
					currency_code: price.currency_code,
				});
			});

			// product categories
			const prodCategories: CategoryInput[] = [];
			categories?.forEach((category) => {
				prodCategories.push({
					code: category.code!,
				});
			});

			// product tags
			const prodTags: TagInput[] = [];
			tags?.forEach((tag) => {
				prodTags.push({
					id: tag.id!,
				});
			});

			// product options
			const prodOptions: ProdOptionInput[] = [];
			options?.forEach((option) => {
				prodOptions.push({
					id: option.id!,
					name: option.name!,
					value: undefined,
					values: option.values?.map((value) => {
						return {
							id: value.id!,
							value: value.value!,
						};
					}),
				});
			});

			// product variants
			const prodVariants: ProdVariantInput[] = [];
			variants?.forEach((variant) => {
				prodVariants.push({
					id: variant.id!,
					name: variant.name!,
					price_types: variant.price_types?.map((price) => {
						return {
							id: price.id,
							orig_sell_price: price.orig_sell_price,
							cost_price: price.cost_price,
							sale_price: price.sale_price,
							currency_code: price.currency_code,
						};
					}),
					options: variant.options,
				});
			});

			await productStore.updateProduct(code!, {
				code,
				name,
				short_desc: short_desc ?? undefined,
				long_desc: long_desc ?? undefined,
				is_active,
				is_discountable: true,
				is_giftcard: false,
				price_types: prodPrice,
				categories: prodCategories,
				tags: prodTags,
				status: status,
				galleries: galleries ?? undefined,
				thumbnail: thumbnail ?? undefined,
				options: prodOptions,
				variants: prodVariants,
			});

			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};
</script>

<style scoped lang="postcss"></style>
