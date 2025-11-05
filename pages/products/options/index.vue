<template>
	<UDashboardPanel id="products-options">
		<template #header>
			<UDashboardNavbar title="Options" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
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
					<ZSectionFilterBrands />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table Controls -->
				<div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
					<!-- Page Size -->
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
						<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="productOptionsStore.updatePageSize" />
						<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
					</div>

					<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportOptions">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</div>

				<UTable :data="rows" :columns="product_option_columns" :loading="loading" @select="selectProductOption" />

				<!-- Pagination  -->
				<div v-if="prod_option.length > 0" class="section-pagination">
					<UPagination :default-page="filter.current_page" :items-per-page="filter.page_size" :total="total_options" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalOptionDetail } from '#components';
import { product_option_columns } from '~/utils/table-columns';
import type { ProductOption } from '~/utils/types/product-option';
import type { ProductOptionValue } from '~/utils/types/product-option-value';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';

useHead({ title: 'Wemotoo CRM - Options' });

const overlay = useOverlay();
const productOptionsStore = useProductOptionStore();
await productOptionsStore.getOptions();

const { loading, prod_option, filter, exporting } = storeToRefs(productOptionsStore);
const { total_options } = storeToRefs(productOptionsStore);

const rows = computed(() => {
	return prod_option.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const deleteProductOption = async (id: number) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this option?',
			action: 'delete',
			onConfirm: async () => {
				await productOptionsStore.deleteProductOption(id);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectProductOption = async (e: Event, row: TableRow<ProductOption>) => {
	const option = row.original;

	if (!option) return;

	const optionModal = overlay.create(ZModalOptionDetail, {
		props: {
			productOption: JSON.parse(JSON.stringify(option)),
			onUpdate: async (name: string, values: ProductOptionValue[]) => {
				await productOptionsStore.updateProductOption(option.id!, name, values);
				optionModal.close();
			},
			onDelete: async () => {
				optionModal.close();
				await deleteProductOption(option.id!);
			},
			onCancel: () => {
				optionModal.close();
			},
		},
	});

	optionModal.open();
};

const updatePage = async (page: number) => {
	await productOptionsStore.updatePage(page);
};

const exportOptions = async () => {
	// await productOptionsStore.exportOptions();
};
</script>

<style scoped>
.base {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1rem;
}

@media (min-width: 640px) {
	.base {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
}

.section-empty {
	height: 13rem;
}

.section-empty div {
	text-align: center;
}

.section-empty h2 {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 600;
}

.section-empty p {
	color: var(--color-neutral-400);
}
</style>
