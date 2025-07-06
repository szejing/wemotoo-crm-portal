<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Brand</h2>
					<FormProductBrandCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<ZSectionFilterBrands />

					<div class="mt-4">
						<!-- Table  -->
						<UTable :rows="rows" :columns="brand_columns" :loading="loading" @select="selectBrand">
							<template #code-data="{ row }">
								<div class="flex flex-col-start sm:flex-row sm:justify-start sm:items-center gap-2">
									<NuxtImg v-if="row.thumbnail" :src="row.thumbnail?.url" class="w-15 h-15 rounded-sm" />
									<h5 class="font-bold text-secondary-800">{{ row.code }}</h5>
								</div>
							</template>

							<template #name-data="{ row }">
								<div>
									<h5 class="font-bold text-secondary-800">{{ row.name }}</h5>
								</div>
							</template>

							<template #total_items-header>
								<h5 class="text-center">No of Items</h5>
							</template>

							<template #total_items-data="{ row }">
								<h5 class="text-neutral-500 text-center">{{ row.total_items }}</h5>
							</template>

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No Brands Found</h2>
									<p>Create a new brand to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="brands.length > 0" class="section-pagination">
							<UPagination v-model="current_page" :page-count="page_size" :total="total_brands" @update:model-value="updatePage" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalBrandDetail, ZModalConfirmation } from '#components';
import { brand_columns } from '~/utils/table-columns';
import type { Brand } from '~/utils/types/brand';

const links = [
	{
		label: 'Products',
		icon: ICONS.LIST,
		to: '/products',
	},
	{
		label: 'All Brands',
		icon: ICONS.ADDITIONAL,
		to: '/products/brands',
	},
];

const modal = useModal();
const brandStore = useBrandStore();

onMounted(async () => {
	await brandStore.getBrands();
});

const { loading, brands, total_brands, page_size, current_page } = storeToRefs(brandStore);

const rows = computed(() => {
	return brands.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const deleteBrand = async (code: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this brand?',
		action: 'delete',
		onConfirm: async () => {
			await brandStore.deleteBrand(code);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectBrand = async (brand: Brand) => {
	if (!brand) return;
	modal.open(ZModalBrandDetail, {
		brand: JSON.parse(JSON.stringify(brand)),
		onUpdate: async ({ description, is_active }) => {
			await brandStore.updateBrand(description, is_active);
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteBrand(brand.code);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const updatePage = async (page: number) => {
	await brandStore.updatePage(page);
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
	@apply text-gray-400;
}
</style>
