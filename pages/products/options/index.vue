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
						<UTable :rows="rows" :columns="product_option_columns" :loading="loading" @select="selectProductOption">
							<template #values-data="{ row }">
								<span>{{ row.values.map((v: ProductOptionValue) => v.value).join(' · ') }}</span>
							</template>

							<!-- <template #actions-data="{ row }">
								<ZActionDropdown :items="options(row)" />
							</template> -->

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

const modal = useModal();
const productOptionsStore = useProductOptionStore();
await productOptionsStore.getOptions();

const { loading, prod_option, page_size, current_page } = storeToRefs(productOptionsStore);
const { total_options } = storeToRefs(productOptionsStore);

const rows = computed(() => {
	return prod_option.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
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

const selectProductOption = async (option: ProductOption) => {
	if (!option) return;

	modal.open(ZModalOptionDetail, {
		productOption: JSON.parse(JSON.stringify(option)),
		onUpdate: async (name: string, values: ProductOptionValue[]) => {
			await productOptionsStore.updateProductOption(option.id!, name, values);
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteProductOption(option.id!);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const updatePage = async (page: number) => {
	await productOptionsStore.updatePage(page);
};
</script>

<style scoped lang="postcss">
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
	@apply text-neutral-400;
}
</style>
