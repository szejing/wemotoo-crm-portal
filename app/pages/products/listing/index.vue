<template>
	<UDashboardPanel id="products-listing">
		<template #header>
			<UDashboardNavbar :title="$t('nav.products')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<ZCreateButton to="/products/create" />
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

				<template v-if="initialize">
					<div class="rounded-lg overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
						<div class="grid grid-cols-4 gap-4 p-4">
							<USkeleton v-for="i in 4" :key="i" class="h-4 flex-1 min-w-0" />
						</div>
						<div v-for="i in 5" :key="i" class="grid grid-cols-4 gap-4 p-4 items-center">
							<USkeleton v-for="j in 4" :key="j" class="h-4 flex-1 min-w-0" />
						</div>
					</div>
				</template>
				<UTable
					v-else
					:data="products"
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
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noProductsFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<div v-if="!initialize && products.length > 0" class="section-pagination">
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
const loadingModal = overlay.create(ZModalLoading, { props: { key: 'loading' } });

const { t } = useI18n();
const product_columns = computed(() => getProductColumns(t));
useHead({ title: () => t('pages.productsTitle') });

const { products, loading, filter, total_products, exporting, updating } = storeToRefs(productStore);
const initialize = ref(true);

onMounted(async () => {
	initialize.value = true;
	try {
		await productStore.getProducts();
	} finally {
		initialize.value = false;
	}
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
