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

					<div v-if="productOptions.length > 0">
						<!-- Table  -->
						<UTable :rows="rows" :columns="product_option_columns">
							<template #values-data="{ row }">
								<span>{{ row.values.join(' · ') }}</span>
							</template>

							<template #actions-data="{ row }">
								<ZActionDropdown :items="options(row)" />
							</template>
						</UTable>

						<!-- Pagination  -->
						<div class="section-pagination">
							<UPagination v-model="page" :page-count="pageSize" :total="productOptions.length" />
						</div>
					</div>

					<div v-else class="flex-center section-empty">
						<div>
							<h2>No Options Found</h2>
							<p>Create a new option to get started</p>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useProductOptionsStore } from '~/stores/ProductOptions/ProductOptions';
import { product_option_columns } from '~/utils/table-columns';
import type { ProductOption } from '~/utils/types/product-option';

const links = [
	{
		label: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/products',
	},
	{
		label: 'All Options',
		icon: 'i-material-symbols-light-lists-rounded',
		to: '/products/options',
	},
];

const options = (row: ProductOption) => [
	[
		{
			label: 'Edit',
			icon: 'i-heroicons-pencil-square-20-solid',
			click: () => console.log('Edit', row.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: 'i-heroicons-trash-20-solid',
			slot: 'danger',
			click: () => console.log('Delete', row.id),
		},
	],
];

const page = ref(1);
const productOptionsStore = useProductOptionsStore();

const { productOptions, pageSize } = storeToRefs(productOptionsStore);

const rows = computed(() => {
	return productOptions.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
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
