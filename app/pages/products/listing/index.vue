<template>
	<UDashboardPanel id="products-listing">
		<template #header>
			<UDashboardNavbar :title="$t('nav.products')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<div class="flex items-center gap-3">
						<UButton color="success" @click="navigateTo('/products/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="w-4 h-4" />
							Create
						</UButton>
					</div>
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterProducts />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table Controls -->
				<ZTableToolbar
					v-model="filter.page_size"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="exporting"
					@update:model-value="updatePageSize"
					@export="exportProducts"
				/>

				<!-- Table -->
				<UTable
					:data="rows"
					:columns="product_columns"
					:loading="loading"
					:ui="{
						tr: 'cursor-pointer',
					}"
					@select="selectProduct"
				>
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.PRODUCT" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No products found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
						</div>
					</template>
				</UTable>

				<div v-if="products.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_products" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { getProductColumns } from '~/utils/table-columns';
import type { Product } from '~/utils/types/product';
import type { TableRow } from '@nuxt/ui';
import { ZModalLoading } from '#components';

const productStore = useProductStore();
const overlay = useOverlay();
const loadingModal = overlay.create(ZModalLoading, {
	props: {
		key: 'loading',
	},
});

const { t } = useI18n();
const product_columns = computed(() => getProductColumns(t));
useHead({ title: () => t('pages.productsTitle') });

onMounted(() => productStore.getProducts());

const { products, loading, filter, total_products, exporting, updating } = storeToRefs(productStore);

const rows = computed(() => {
	return products.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

watch(
	() => updating.value,
	(value: boolean) => {
		if (value) {
			loadingModal.open();
		} else {
			loadingModal.close();
		}
	},
);

watch(
	() => exporting.value,
	(value: boolean) => {
		if (value) {
			loadingModal.open();
		} else {
			loadingModal.close();
		}
	},
);

const selectProduct = async (e: Event, row: TableRow<Product>) => {
	const product = row.original;
	if (!product) return;

	navigateTo(`/products/${product.code}`);
};

const updatePage = async (page: number) => {
	await productStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await productStore.updatePageSize(size);
};

const exportProducts = async () => {
	await productStore.exportProducts();
};
</script>

<style scoped></style>
