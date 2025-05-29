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

				<UTable :rows="rows" :columns="product_columns" :loading="loading" @select="selectProduct">
					<template #code-data="{ row }">
						<div class="flex flex-col-start sm:flex-row sm:justify-start sm:items-center gap-2">
							<NuxtImg v-if="row.thumbnail" :src="row.thumbnail?.url" class="w-10 h-10 rounded-sm" />
							<h5 class="font-bold text-secondary-800">{{ row.code }}</h5>
						</div>
					</template>

					<template #orig_sell_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">{{ price.currency_code }} {{ price.orig_sell_price.toFixed(2) }}</p>
					</template>

					<template #sale_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">
							<span v-if="price.sale_price != undefined && price.sale_price > 0">{{ price.currency_code }} {{ price.sale_price.toFixed(2) }}</span>
							<span v-else> - </span>
						</p>
					</template>

					<template #name-data="{ row }">
						<p class="font-bold">
							{{ row.name }}
						</p>
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
import { ZModalLoading } from '#components';
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
		to: '/products/listing',
	},
];

const modal = useModal();
const page = ref(1);
const productStore = useProductStore();

onMounted(() => {
	productStore.getProducts();
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const { products, loading, pageSize } = storeToRefs(productStore);

const rows = computed(() => {
	return products.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const selectProduct = async (product: Product) => {
	modal.open(ZModalLoading, {
		key: 'loading',
	});

	const prod = await productStore.getProduct(product.code!);
	await modal.close();

	if (prod) {
		productStore.current_product = prod;

		navigateTo(`/products/listing/${product.code}/detail`);
	}
};
</script>

<style scoped lang="postcss"></style>
