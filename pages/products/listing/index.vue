<template>
	<UDashboardPanel id="products-listing">
		<template #header>
			<UDashboardNavbar title="Products" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZSectionFilterProducts />

			<UCard>
				<div class="flex-between">
					<span class="section-page-size">
						Show :
						<USelect v-model="page_size" :items="options_page_size" />
					</span>

					<div class="flex gap-4">
						<UButton color="success" @click="navigateTo('/products/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>

				<UTable :data="rows" :columns="product_columns" :loading="loading" @select-row="selectProduct" />

				<div v-if="products.length > 0" class="section-pagination">
					<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_products" @update:page="updatePage" />
				</div>
			</UCard>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalLoading } from '#components';
import { options_page_size } from '~/utils/options';
import { product_columns } from '~/utils/table-columns';
import type { Product } from '~/utils/types/product';

const overlay = useOverlay();
const productStore = useProductStore();

useHead({ title: 'Wemotoo CRM - Products' });

onMounted(() => productStore.getProducts());

const { products, loading, page_size, current_page, total_products } = storeToRefs(productStore);

const rows = computed(() => {
	return products.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const selectProduct = async (product: Product) => {
	const loadingModal = overlay.create(ZModalLoading, {
		props: {
			key: 'loading',
		},
	});

	loadingModal.open();

	const prod = await productStore.getProduct(product.code!);
	loadingModal.close();

	if (prod) {
		productStore.current_product = prod;

		navigateTo(`/products/listing/${product.code}/detail`);
	}
};

const updatePage = async (page: number) => {
	await productStore.updatePage(page);
};
</script>

<style scoped></style>
