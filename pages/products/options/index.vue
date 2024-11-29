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
						<UTable :rows="rows" :columns="product_option_columns" :loading="loading">
							<template #values-data="{ row }">
								<span>{{ row.values.map((v: ProductOptionValue) => v.value).join(' · ') }}</span>
							</template>

							<template #actions-data="{ row }">
								<ZActionDropdown :items="options(row)" />
							</template>

							<template #empty-state>
								<div class="flex-center section-empty">
									<div>
										<h2>No Options Found</h2>
										<p>Create a new option to get started</p>
									</div>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="productOptions.length > 0" class="section-pagination">
							<UPagination v-model="page" :page-count="pageSize" :total="productOptions.length" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalOptionDetail } from '#components';
import { useProductOptionsStore } from '~/stores/ProductOptions/ProductOptions';
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

const options = (row: ProductOption) => [
	[
		{
			label: 'Edit',
			icon: ICONS.PENCIL,
			click: async () => await editProductOption(row.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
			slot: 'danger',
			click: async () => await deleteProductOption(row.id),
		},
	],
];

const modal = useModal();
const page = ref(1);
const productOptionsStore = useProductOptionsStore();
await productOptionsStore.getOptions();

const { loading, productOptions, pageSize } = storeToRefs(productOptionsStore);

const rows = computed(() => {
	return productOptions.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const deleteProductOption = async (id: number) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this option?',
		action: 'delete',
		onConfirm: async () => {
			await productOptionsStore.deleteProductOption(id);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const editProductOption = async (optionId: number) => {
	const option: ProductOption | undefined = productOptions.value.find((option) => option.id === optionId);

	if (!option) return;

	modal.open(ZModalOptionDetail, {
		productOption: JSON.parse(JSON.stringify(option)),
		onUpdate: async (name: string, values: ProductOptionValue[]) => {
			await productOptionsStore.updateProductOption(optionId, name, values);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};
</script>

<style scoped lang="css">
.base {
	@apply container grid grid-cols-1 sm:grid-cols-6 gap-6 mt-4;
}

.section-empty {
	@apply h-52;
}

.section-empty div {
	@apply text-center;
}

.section-empty h2 {
	@apply text-2xl font-semibold;
}

.section-empty p {
	@apply text-gray-400;
}
</style>
