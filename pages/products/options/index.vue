<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Option</h2>
					<FormProductOptionCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<ZSectionFilterOptions />

					<div>
						<!-- Table  -->
						<UTable :data="rows" :columns="product_option_columns" :loading="loading" @select-row="selectProductOption" />

						<!-- Pagination  -->
						<div v-if="prod_option.length > 0" class="section-pagination">
							<UPagination v-model="current_page" :page-count="page_size" :total="total_options" @update:model-value="updatePage" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalOptionDetail } from '#components';
import { product_option_columns } from '~/utils/table-columns';
import type { ProductOption } from '~/utils/types/product-option';
import type { ProductOptionValue } from '~/utils/types/product-option-value';

const links = [
	{
		label: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
	},
	{
		label: 'All Options',
		icon: ICONS.LIST,
		to: '/products/options',
	},
];

useHead({ title: 'Wemotoo CRM - Options' });

const overlay = useOverlay();
const productOptionsStore = useProductOptionStore();
await productOptionsStore.getOptions();

const { loading, prod_option, page_size, current_page } = storeToRefs(productOptionsStore);
const { total_options } = storeToRefs(productOptionsStore);

const rows = computed(() => {
	return prod_option.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
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

const selectProductOption = async (option: ProductOption) => {
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
