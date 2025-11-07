<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Update Product</h2>
			<div class="block sm:hidden">
				<div class="section-menu" @click="isOpen = !isOpen">
					<UIcon :name="ICONS.MENU_OPEN_ROUNDED" class="size-7 block sm:hidden" />
				</div>
			</div>
		</div>
		<div class="wrapper-grid">
			<!-- ***** Form ***** -->
			<FormProductUpdate class="col-span-3" @update:product="updateProduct" @delete:variant="deleteVariant" />

			<div class="side-wrapper">
				<ZInputProductSidebar
					:product="current_product!"
					@update:status="updateStatus"
					@update:categories="updateCategories"
					@update:tags="updateTags"
					@update:thumbnail="updateThumbnail"
					@update:images="updateImages"
				/>
			</div>

			<UModal v-model:open="isOpen">
				<UCard
					:ui="{
						body: {
							base: 'container mx-auto',
							background: '',
							padding: 'px-4 py-5 sm:p-6',
						},
					}"
				>
					<template #header>
						<div class="flex-jbetween-icenter">
							<h2>Product Status & Thumbnails</h2>
							<UIcon :name="ICONS.CLOSE_ROUNDED" class="size-7 text-secondary-600" @click="isOpen = false" />
						</div>
					</template>

					<ZInputProductSidebar
						:product="current_product!"
						@update:status="updateStatus"
						@update:categories="updateCategories"
						@update:tags="updateTags"
						@update:thumbnail="updateThumbnail"
						@update:images="updateImages"
					/>
				</UCard>
			</UModal>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalLoading } from '#components';
import type { ProductStatus } from 'wemotoo-common';
import { failedNotification } from '~/stores/AppUi/AppUi';
import type { Category } from '~/utils/types/category';
import type { ProductVariantInput } from '~/utils/types/product';
import type { Tag } from '~/utils/types/tag';

definePageMeta({
	middleware: ['product-detail'],
});

const links = [
	{
		label: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
	},
	{
		label: 'New Product',
		to: '/create',
	},
];

const isOpen = ref(false);

const overlay = useOverlay();
const productStore = useProductStore();
const { current_product } = storeToRefs(productStore);
const new_thumbnail = ref<File | undefined>(undefined);
const new_images = ref<File[]>([]);

useHead({ title: 'Wemotoo CRM - Product Detail #' + current_product.value?.code });

onBeforeRouteLeave(() => {
	current_product.value = undefined;
});

// const deleteProduct = async (code: string) => {
// 	modal.open(ZModalConfirmation, {
// 		message: 'Are you sure you want to delete this product ?',
// 		key: 'delete-product',
// 		action: 'delete',
// 		onConfirm: async () => {
// 			await productStore.deleteProduct(code);
// 			modal.close();
// 		},
// 		onCancel: () => {
// 			modal.close();
// 		},
// 	});
// };

const updateStatus = (value: ProductStatus) => {
	if (current_product.value) {
		current_product.value.status = value;
	}
};

const updateCategories = (value: Category[]) => {
	if (current_product.value) {
		current_product.value.categories = value;
	}
};

const updateTags = (value: Tag[]) => {
	if (current_product.value) {
		current_product.value.tags = value;
	}
};

const updateThumbnail = (value: File) => {
	new_thumbnail.value = value;
};

const updateImages = (value: File[]) => {
	new_images.value = value;
};

const updateProduct = async () => {
	const loadingModal = overlay.create(ZModalLoading, {
		props: {
			key: 'loading',
		},
	});

	loadingModal.open();

	try {
		await productStore.updateProduct(new_thumbnail.value, new_images.value);

		navigateTo(`/products`);
	} catch (error) {
		console.error(error);
	} finally {
		loadingModal.close();
	}
};

const deleteVariant = async (variant: ProductVariantInput) => {
	const { product_code, variant_code } = variant;

	if (!product_code || !variant_code) {
		failedNotification('Something went wrong');
		return;
	}

	const loadingModal = overlay.create(ZModalLoading, {
		props: {
			key: 'loading',
		},
	});

	loadingModal.open();

	try {
		await productStore.deleteVariant(product_code, variant_code);
		navigateTo(`/products`);
	} catch (error) {
		console.error(error);
	} finally {
		loadingModal.close();
	}
};

// const editProduct = async (product: Product) => {
// modal.open(ZModalProductDetail, {
// 	product: JSON.parse(JSON.stringify(product)),
// 	key: 'product-detail',
// 	onDelete: async () => {
// 		await modal.close();
// 		deleteProduct(code!);
// 	},
// 	onUpdate: async (prod: Product) => {
// 		const { code, name, short_desc, long_desc, is_active, price_types, categories, tags, status, images, thumbnail, options, variants, type } = prod;
// 		// price_types
// 		const prodPrice: PriceInput[] = [];
// 		price_types?.forEach((price) => {
// 			prodPrice.push({
// 				id: price.id,
// 				orig_sell_price: price.orig_sell_price,
// 				cost_price: price.cost_price,
// 				sale_price: price.sale_price,
// 				currency_code: price.currency_code,
// 			});
// 		});
// 		// product categories
// 		const prodCategories: CategoryInput[] = [];
// 		categories?.forEach((category) => {
// 			prodCategories.push({
// 				code: category.code!,
// 			});
// 		});
// 		// product tags
// 		const prodTags: TagInput[] = [];
// 		tags?.forEach((tag) => {
// 			prodTags.push({
// 				id: tag.id!,
// 			});
// 		});
// 		// product options
// 		const prodOptions: ProductOptionInput[] = [];
// 		options?.forEach((option) => {
// 			prodOptions.push({
// 				id: option.id!,
// 				name: option.name!,
// 				values: option.values?.map((value) => {
// 					return {
// 						id: value.id!,
// 						value: value.value!,
// 					};
// 				}),
// 			});
// 		});
// 		// product variants
// 		const prodVariants: ProdVariantInput[] = [];
// 		variants?.forEach((variant) => {
// 			prodVariants.push({
// 				variant_code: variant.variant_code!,
// 				product_code: variant.product_code!,
// 				name: variant.name!,
// 				price_types: variant.price_types?.map((price) => {
// 					return {
// 						id: price.id,
// 						orig_sell_price: price.orig_sell_price,
// 						cost_price: price.cost_price,
// 						sale_price: price.sale_price,
// 						currency_code: price.currency_code,
// 					};
// 				}),
// 				options: variant.options?.map((option) => {
// 					return {
// 						id: option.id!,
// 						option_id: option.option_id!,
// 						value: option.value!,
// 					};
// 				}),
// 			});
// 		});
// 		await productStore.updateProduct(code!, {
// 			code,
// 			name,
// 			short_desc: short_desc ?? undefined,
// 			long_desc: long_desc ?? undefined,
// 			is_active,
// 			is_discountable: true,
// 			is_giftcard: false,
// 			type: type,
// 			price_types: prodPrice,
// 			categories: prodCategories,
// 			tags: prodTags,
// 			status: status,
// 			images: images ?? undefined,
// 			thumbnail: thumbnail ?? undefined,
// 			options: prodOptions,
// 			variants: prodVariants,
// 			metadata: undefined,
// 		});
// 		modal.close();
// 	},
// 	onCancel: () => {
// 		modal.close();
// 	},
// });
// };
</script>

<style scoped>
.wrapper-grid {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1rem;
}

@media (min-width: 640px) {
	.wrapper-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.side-wrapper {
	display: none;
	grid-column: span 1 / span 1;
}

@media (min-width: 640px) {
	.side-wrapper {
		display: block;
	}
}

h2 {
	color: var(--color-secondary-600);
	font-weight: 400;
}

.section-menu {
	background-color: white;
	box-shadow:
		0 4px 6px -1px rgb(0 0 0 / 0.1),
		0 2px 4px -2px rgb(0 0 0 / 0.1);
	padding: 0.5rem;
	border-radius: 9999px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--color-secondary-600);
}
</style>
