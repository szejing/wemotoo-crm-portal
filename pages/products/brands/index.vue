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
						<UTable :data="rows" :columns="brand_columns" :loading="loading" @select-row="selectBrand" />

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

const overlay = useOverlay();
const brandStore = useBrandStore();

useHead({ title: 'Wemotoo CRM - Brands' });

onMounted(async () => {
	await brandStore.getBrands();
});

const { loading, brands, total_brands, page_size, current_page } = storeToRefs(brandStore);

const rows = computed(() => {
	return brands.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const deleteBrand = async (code: string) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this brand?',
			action: 'delete',
			onConfirm: async () => {
				await brandStore.deleteBrand(code);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectBrand = async (brand: Brand) => {
	if (!brand) return;
	const brandModal = overlay.create(ZModalBrandDetail, {
		props: {
			brand: JSON.parse(JSON.stringify(brand)),
			onUpdate: async ({ description, is_active }) => {
				await brandStore.updateBrand(description, is_active);
				brandModal.close();
			},
			onDelete: async () => {
				brandModal.close();
				await deleteBrand(brand.code);
			},
			onCancel: () => {
				brandModal.close();
			},
		},
	});

	brandModal.open();
};

const updatePage = async (page: number) => {
	await brandStore.updatePage(page);
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
