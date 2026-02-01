<template>
	<div class="w-full">
		<!-- Two Column Layout: Sidebar + Form -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<!-- Left Sidebar Navigation (Sticky) -->
			<div class="hidden lg:block lg:col-span-3">
				<div class="sticky top-4">
					<nav class="space-y-2">
						<div
							v-for="section in sections"
							:key="section.id"
							class="cursor-pointer rounded-lg px-4 py-3 transition-all duration-200"
							:class="[activeSection === section.id ? 'bg-primary-500 text-white shadow-md' : 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900']"
							@click="scrollToSection(section.id)"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold"
									:class="[activeSection === section.id ? 'bg-white text-primary-500' : 'bg-neutral-200 text-neutral-600']"
								>
									{{ section.number }}
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2">
										<span class="text-sm font-medium truncate">{{ section.name }}</span>
										<span v-if="section.required" class="text-red-500 text-xs">*</span>
									</div>

									<p class="text-xs opacity-80 truncate" :class="[activeSection === section.id ? 'text-main-100' : 'text-neutral-700']">
										{{ section.description }}
									</p>
								</div>
							</div>
						</div>
					</nav>
				</div>
			</div>

			<!-- Right Content Area (Scrollable) -->
			<div class="lg:col-span-9">
				<!-- Single Form with all sections -->
				<UForm :schema="UpdateProductValidation" :state="formState" class="space-y-6 mb-6" @submit="onSubmit">
					<!-- Section 1: Basic Information -->
					<UCard id="section-basic-info" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.INFO" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">Basic Information</h2>
										<span class="text-red-500 text-sm">*</span>
									</div>
									<p class="text-sm text-neutral-500 mt-1">Essential product details, images, and settings</p>
								</div>
								<UTooltip text="Enter the essential information about your product including name, description, and images." :popper="{ placement: 'bottom' }">
									<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-5 h-5 cursor-help" />
								</UTooltip>
							</div>
						</template>

						<div class="space-y-6 p-4 sm:p-6">
							<!-- Product Basic Fields -->
							<div class="space-y-4">
								<div class="w-full flex justify-end">
									<UCheckbox color="success" v-model="formState.is_active" label="Active" />
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField label="Product Code">
										<p class="text-xs text-neutral-500 my-1">Unique identifier for your product</p>
										<UInput v-model="formState.code" placeholder="e.g., PROD-001 (auto-generated if empty)" disabled />
									</UFormField>
									<UFormField label="Product Name" required>
										<p class="text-xs text-neutral-500 my-1">The name customers will see</p>
										<UInput v-model="formState.name" placeholder="e.g., Chicken Rice Set" />
									</UFormField>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField label="Short Description">
										<p class="text-xs text-neutral-500 my-1">Brief description for product listings</p>
										<UInput v-model="formState.short_desc" placeholder="e.g., Delicious chicken rice with soup" />
									</UFormField>
									<UFormField label="Product Type" required>
										<p class="text-xs text-neutral-500 my-1">Choose 'Item' for physical products, 'Service' for services</p>
										<ZSelectMenuProductType v-model:type-id="formState.type_id" class="w-full" />
									</UFormField>
								</div>
							</div>

							<hr class="my-6" />

							<!-- Product Images -->
							<div class="space-y-4">
								<h3 class="text-lg font-semibold">Product Images</h3>
								<div class="flex flex-col gap-6 sm:flex-row sm:justify-between">
									<div class="flex flex-col w-full">
										<div class="flex items-center gap-2 mb-2">
											<h4 class="text-md font-medium">Thumbnail</h4>
											<UTooltip text="Main image shown in product listings (square format recommended)" :popper="{ placement: 'right' }">
												<UIcon :name="ICONS.HELP" class="text-neutral-400 w-4 h-4 cursor-help" />
											</UTooltip>
										</div>
										<p class="text-xs text-neutral-500 mb-3">Recommended: 1:1 ratio (e.g., 800x800px)</p>
										<ZDropzone
											class="max-w-full sm:max-w-[250px]"
											:existing-images="formState.thumbnail ? [formState.thumbnail] : []"
											@files-selected="updateThumbnail"
											@delete-image="deleteThumbnail"
										/>
									</div>

									<div class="flex flex-col w-full">
										<div class="flex items-center gap-2 mb-2">
											<h4 class="text-md font-medium">Additional Images</h4>
											<UTooltip text="More images shown on the product detail page (max 3)" :popper="{ placement: 'right' }">
												<UIcon :name="ICONS.HELP" class="text-neutral-400 w-4 h-4 cursor-help" />
											</UTooltip>
										</div>
										<p class="text-xs text-neutral-500 mb-3">Max 3 images, 1:1 ratio recommended</p>
										<ZDropzone
											multiple
											:max-images="3"
											class="max-w-full sm:max-w-[250px]"
											:existing-images="formState.images"
											@files-selected="updateImages"
											@delete-image="deleteImage"
										/>
									</div>
								</div>
							</div>
						</div>
					</UCard>

					<!-- Section 2: Classification -->
					<UCard id="section-classification" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.TAG" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">Classification</h2>
										<span class="text-xs text-neutral-500 ml-2">(Optional)</span>
									</div>
									<p class="text-sm text-neutral-500 mt-1">Organize your product with categories, tags, and brands</p>
								</div>
								<UTooltip text="Add categories, tags, and brands to help customers find your product easily." :popper="{ placement: 'bottom' }">
									<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-5 h-5 cursor-help" />
								</UTooltip>
							</div>
						</template>

						<div class="p-4 sm:p-6">
							<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
								<div class="flex items-start gap-3">
									<UIcon :name="ICONS.INFO" class="text-blue-500 w-5 h-5 mt-0.5 shrink-0" />
									<div>
										<h4 class="text-sm font-medium text-blue-900">About Classification</h4>
										<p class="text-xs text-blue-700 mt-1">
											Organize your product with categories, tags, and brands. This helps customers find your products easily.
										</p>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
								<div>
									<div class="flex items-center gap-2">
										<h3 class="text-base font-medium">Categories</h3>
										<UTooltip text="Main product categories (e.g., Food, Beverages)" :popper="{ placement: 'top' }">
											<UIcon :name="ICONS.HELP" class="text-neutral-400 w-4 h-4 cursor-help" />
										</UTooltip>
									</div>
									<ZSelectMenuCategories v-model:categories="categories" class="w-full" placeholder="Select categories..." />
								</div>

								<div>
									<div class="flex items-center gap-2">
										<h3 class="text-base font-medium">Tags</h3>
										<UTooltip text="Keywords for filtering (e.g., Spicy, Vegetarian)" :popper="{ placement: 'top' }">
											<UIcon :name="ICONS.HELP" class="text-neutral-400 w-4 h-4 cursor-help" />
										</UTooltip>
									</div>
									<ZSelectMenuTags v-model:tags="tags" class="w-full" placeholder="Select tags..." />
								</div>

								<div>
									<div class="flex items-center gap-2">
										<h3 class="text-base font-medium">Brands</h3>
										<UTooltip text="Product brand or manufacturer" :popper="{ placement: 'top' }">
											<UIcon :name="ICONS.HELP" class="text-neutral-400 w-4 h-4 cursor-help" />
										</UTooltip>
									</div>
									<ZSelectMenuBrands v-model:brands="brands" class="w-full" placeholder="Select brands..." />
								</div>
							</div>
						</div>
					</UCard>

					<!-- Section 3: Pricing -->
					<UCard id="section-pricing" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.CURRENCY" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">Pricing</h2>
										<span class="text-red-500 text-sm">*</span>
									</div>
									<p class="text-sm text-neutral-500 mt-1">Set your product prices and currency</p>
								</div>
								<UTooltip text="Define the pricing for your product including regular price, cost, and optional sale price." :popper="{ placement: 'bottom' }">
									<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-5 h-5 cursor-help" />
								</UTooltip>
							</div>
						</template>

						<div class="p-4 sm:p-6 space-y-6">
							<div class="bg-green-50 border border-green-200 rounded-lg p-4">
								<div class="flex items-start gap-3">
									<UIcon :name="ICONS.INFO" class="text-green-600 w-5 h-5 mt-0.5 shrink-0" />
									<div>
										<h4 class="text-sm font-medium text-green-900">Pricing Information</h4>
										<p class="text-xs text-green-700 mt-1">Set your prices. Sale price is optional and will be displayed as a discount.</p>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<UFormField label="Currency">
									<p class="text-xs text-neutral-500 my-1">Currency</p>
									<ZSelectMenuCurrency :currency-code="currency_code" class="w-full" @update:currency="updateCurrency" />
								</UFormField>

								<UFormField label="Original Selling Price" required>
									<p class="text-xs text-neutral-500 my-1">Your selling price for this product</p>
									<UInput v-model.number="orig_sell_price" type="number" placeholder="e.g., 15.00" :min="0" :step="0.01" />
								</UFormField>

								<UFormField label="Cost Price (Optional)">
									<p class="text-xs text-neutral-500 my-1">Your cost for this product (for profit tracking)</p>
									<UInput v-model.number="cost_price" type="number" placeholder="e.g., 10.00" :min="0" :step="0.01" />
								</UFormField>

								<UFormField label="Sale Price (Optional)">
									<p class="text-xs text-neutral-500 my-1">Discounted price (leave empty if no discount)</p>
									<UInput v-model.number="sale_price" type="number" placeholder="e.g., 12.00" :min="0" :step="0.01" />
								</UFormField>
							</div>

							<!-- Price Preview -->
							<div v-if="orig_sell_price" class="p-4 bg-neutral-50 rounded-lg">
								<h4 class="text-sm font-medium mb-3">Price Preview</h4>
								<div class="flex flex-wrap items-center gap-3">
									<div v-if="sale_price && sale_price < orig_sell_price" class="text-2xl font-bold text-green-600">
										{{ currency_code }} {{ sale_price.toFixed(2) }}
									</div>
									<div class="text-lg" :class="sale_price && sale_price < orig_sell_price ? 'line-through text-neutral-500' : 'font-bold text-neutral-900'">
										{{ currency_code }} {{ orig_sell_price.toFixed(2) }}
									</div>
									<div v-if="sale_price && sale_price < orig_sell_price" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
										{{ Math.round(((orig_sell_price - sale_price) / orig_sell_price) * 100) }}% OFF
									</div>
								</div>
								<div v-if="cost_price && orig_sell_price" class="text-xs text-neutral-600 mt-2">
									Profit Margin: {{ currency_code }} {{ (orig_sell_price - cost_price).toFixed(2) }} ({{
										Math.round(((orig_sell_price - cost_price) / orig_sell_price) * 100)
									}}%)
								</div>
							</div>
						</div>
					</UCard>

					<!-- Section 4: Variants (only show for physical items) -->
					<UCard id="section-variants" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">Product Variants</h2>
										<span class="text-xs text-neutral-500 ml-2">(Optional)</span>
									</div>
									<p class="text-sm text-neutral-500 mt-1">Add options like size, color, or other variations</p>
								</div>
								<UTooltip
									text="Add variants like sizes, colors, or other options. Each combination creates a unique variant."
									:popper="{ placement: 'bottom' }"
								>
									<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-5 h-5 cursor-help" />
								</UTooltip>
							</div>
						</template>

						<div class="p-4 sm:p-6">
							<div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
								<div class="flex items-start gap-3">
									<UIcon :name="ICONS.INFO" class="text-purple-600 w-5 h-5 mt-0.5 shrink-0" />
									<div>
										<h4 class="text-sm font-medium text-purple-900">Product Variants</h4>
										<p class="text-xs text-purple-700 mt-1">Add options like size, color, or other variations. Each combination creates a unique variant.</p>
									</div>
								</div>
							</div>

							<ZInputProductAdditionalInfo
								:product="productForAdditionalInfo"
								@update:options="updateProductOptions"
								@update:variants="updateProductVariants"
								@update:metadata="updateProductMetadata"
							/>
						</div>
					</UCard>

					<!-- Section 5: Review Summary -->
					<UCard id="section-review" class="shadow-md border-2 border-primary-200 scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.CHECK_ROUNDED" class="text-primary-600 w-6 h-6" />
										<h2 class="text-xl font-semibold">Review Your Product</h2>
									</div>
									<p class="text-sm text-neutral-500 mt-1">Review all information before creating the product</p>
								</div>
							</div>
						</template>

						<div class="p-4 sm:p-6 space-y-4">
							<div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
								<div class="flex items-start gap-3">
									<UIcon :name="ICONS.CHECK_ROUNDED" class="text-primary-600 w-5 h-5 mt-0.5 shrink-0" />
									<div>
										<h4 class="text-sm font-medium text-primary-900">Ready to Create?</h4>
										<p class="text-xs text-primary-700 mt-1">Please review all information above before submitting. You can scroll up to edit any section.</p>
									</div>
								</div>
							</div>

							<!-- Quick Summary Cards -->
							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<!-- Basic Info Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.INFO" class="text-primary-500 w-4 h-4" />
										Basic Info
									</h4>
									<div class="text-sm space-y-1">
										<p class="truncate">
											<span class="text-neutral-500">Name:</span> <span class="font-medium">{{ formState.name || 'Not set' }}</span>
										</p>
										<p class="truncate">
											<span class="text-neutral-500">Code:</span> <span class="font-medium">{{ formState.code || 'Auto' }}</span>
										</p>
										<p>
											<UBadge :color="formState.is_active ? 'success' : 'error'" variant="soft" size="xs">
												{{ formState.is_active ? 'Active' : 'Inactive' }}
											</UBadge>
										</p>
									</div>
								</div>

								<!-- Pricing Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.CURRENCY" class="text-primary-500 w-4 h-4" />
										Pricing
									</h4>
									<div class="text-sm space-y-1">
										<p>
											<span class="text-neutral-500">Price:</span>
											<span class="font-bold">{{ currency_code }} {{ orig_sell_price?.toFixed(2) || '0.00' }}</span>
										</p>
										<p v-if="sale_price">
											<span class="text-neutral-500">Sale:</span> <span class="font-bold text-green-600">{{ currency_code }} {{ sale_price.toFixed(2) }}</span>
										</p>
										<p v-if="cost_price">
											<span class="text-neutral-500">Cost:</span> <span class="font-medium">{{ currency_code }} {{ cost_price.toFixed(2) }}</span>
										</p>
									</div>
								</div>

								<!-- Classification Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.TAG" class="text-primary-500 w-4 h-4" />
										Classification
									</h4>
									<div class="text-sm space-y-1">
										<p>
											<span class="text-neutral-500">Categories:</span> <span class="font-medium">{{ categories?.length || 0 }}</span>
										</p>
										<p>
											<span class="text-neutral-500">Tags:</span> <span class="font-medium">{{ tags?.length || 0 }}</span>
										</p>
										<p>
											<span class="text-neutral-500">Brands:</span> <span class="font-medium">{{ brands?.length || 0 }}</span>
										</p>
									</div>
								</div>

								<!-- Variants Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-4 h-4" />
										Variants
									</h4>
									<div class="text-sm">
										<p>
											<span class="text-neutral-500">Total:</span> <span class="font-medium">{{ formState.variants?.length || 0 }}</span>
										</p>
										<p>
											<span class="text-neutral-500">Options:</span> <span class="font-medium">{{ formState.options?.length || 0 }}</span>
										</p>
									</div>
								</div>

								<!-- Images Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.IMAGE" class="text-primary-500 w-4 h-4" />
										Images
									</h4>
									<div class="text-sm">
										<p>
											<span class="text-neutral-500">Thumbnail:</span> <span class="font-medium">{{ formState.thumbnail ? '✓' : '✗' }}</span>
										</p>
										<p>
											<span class="text-neutral-500">Gallery:</span> <span class="font-medium">{{ formState.images?.length || 0 }}</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</UCard>
				</UForm>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ProductStatus } from 'wemotoo-common';
import type { Category } from '~/utils/types/category';
import type { Product, ProductOptionInput, ProductVariantInput } from '~/utils/types/product';
import type { Tag } from '~/utils/types/tag';
import type { Brand } from '~/utils/types/brand';
import type { ProductUpdate } from '~/utils/types/form/product-creation';
import { UpdateProductValidation } from '~/utils/schema';
import { ZModalLoading } from '#components';
import type { Image } from '~/utils/types/image';

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
});

// Transform Product (with populated relations) to ProductUpdate (with codes/IDs)
const transformProductToUpdate = (product: Product): ProductUpdate => {
	// Safety check: ensure product is defined
	if (!product) {
		throw new Error('Product is required for transformation');
	}

	return {
		code: product.code,
		name: product.name,
		short_desc: product.short_desc,
		long_desc: product.long_desc,
		is_discountable: product.is_discountable,
		is_giftcard: product.is_giftcard,
		is_active: product.is_active,
		status: product.status,
		type_id: product.type,
		// Transform populated relations to codes/IDs
		category_codes:
			product.categories
				?.filter((cat) => cat != null && cat.code != null)
				.map((cat) => cat.code!)
				.filter((code): code is string => code != null) ?? [],
		tag_ids:
			product.tags
				?.filter((tag) => tag != null && tag.id != null)
				.map((tag) => tag.id!)
				.filter((id): id is number => id != null) ?? undefined,
		brand_codes:
			product.brands
				?.filter((brand) => brand != null && brand.code != null)
				.map((brand) => brand.code!)
				.filter((code): code is string => code != null) ?? undefined,
		// Transform Price[] to PriceInput[]
		price_types:
			product.price_types
				?.filter((price) => price != null)
				.map((price) => ({
					id: price.id,
					currency_code: price.currency_code,
					orig_sell_price: price.orig_sell_price,
					cost_price: price.cost_price,
					sale_price: price.sale_price,
				})) ?? [],
		// Transform ProductOption[] to ProductOptionInput[]
		options:
			product.options
				?.filter((option) => option != null)
				.map((option) => ({
					id: option.id,
					name: option.name,
					values:
						option.values
							?.filter((value) => value != null)
							.map((value) => ({
								id: value.id,
								option_id: value.option_id,
								value: value.value,
							})) ?? [],
				})) ?? [],
		// Transform ProductVariant[] to ProductVariantInput[]
		variants:
			product.variants
				?.filter((variant) => variant != null)
				.map((variant) => ({
					variant_code: variant.variant_code,
					product_code: variant.product_code,
					name: variant.name,
					sku: variant.sku,
					ean: variant.ean,
					upc: variant.upc,
					barcode: variant.barcode,
					hs_code: variant.hs_code,
					inventory_quantity: variant.inventory_quantity,
					allow_backorder: variant.allow_backorder,
					manage_inventory: variant.manage_inventory,
					weight: variant.weight,
					length: variant.length,
					height: variant.height,
					width: variant.width,
					origin_country: variant.origin_country,
					material: variant.material,
					price_types:
						variant.price_types
							?.filter((price) => price != null)
							.map((price) => ({
								id: price.id,
								currency_code: price.currency_code,
								orig_sell_price: price.orig_sell_price,
								cost_price: price.cost_price,
								sale_price: price.sale_price,
							})) ?? [],
					options:
						variant.options
							?.filter((option) => option != null)
							.map((option) => ({
								id: option.id,
								option_id: option.option_id,
								value: option.value,
							})) ?? [],
					metadata: variant.metadata,
				})) ?? [],
		// Keep images as-is (can be Image or File)
		thumbnail: product.thumbnail,
		images: product.images,
		metadata: product.metadata,
	};
};

// Categories, tags, brands state (for UI binding) - declared before watch
const categories = ref<Category[]>(props.product.categories ?? []);
const tags = ref<Tag[]>(props.product.tags ?? []);
const brands = ref<Brand[]>(props.product.brands ?? []);

// Local form state typed as ProductUpdate
const formState = ref<ProductUpdate>(transformProductToUpdate(props.product));

// Watch for prop changes and update form state
watch(
	() => props.product,
	(newProduct) => {
		if (!newProduct) {
			return;
		}
		formState.value = transformProductToUpdate(newProduct);
		// Also update categories, tags, brands refs for UI
		categories.value = newProduct.categories ?? [];
		tags.value = newProduct.tags ?? [];
		brands.value = newProduct.brands ?? [];
	},
	{ deep: true, immediate: true },
);

// Computed property for ZInputProductAdditionalInfo compatibility
// It expects Product type with `type` property, but ProductUpdate has `type_id`
const productForAdditionalInfo = computed(() => ({
	...formState.value,
	type: formState.value.type_id,
}));

// Icons
const ICONS = {
	CHECK_ROUNDED: 'i-heroicons-check-circle-20-solid',
	HELP: 'i-heroicons-question-mark-circle',
	INFO: 'i-heroicons-information-circle',
	ARROW_RIGHT: 'i-heroicons-arrow-right',
	ARROW_LEFT: 'i-heroicons-arrow-left',
	TAG: 'i-heroicons-tag',
	CURRENCY: 'i-heroicons-currency-dollar',
	LAYERS: 'i-heroicons-squares-2x2',
	IMAGE: 'i-heroicons-photo',
	SAVE: 'i-heroicons-document-arrow-down',
};

// State
const activeSection = ref('section-basic-info');

// Section Navigation
const sections = computed(() => [
	{
		id: 'section-basic-info',
		number: 1,
		name: 'Basic Info',
		description: 'Product details & images',
		required: true,
	},
	{
		id: 'section-classification',
		number: 2,
		name: 'Classification',
		description: 'Categories & tags',
		required: false,
	},
	{
		id: 'section-pricing',
		number: 3,
		name: 'Pricing',
		description: 'Set product prices',
		required: true,
	},
	...[{ id: 'section-variants', number: 4, name: 'Product Variants', description: 'Options & variations', required: false }],
	{
		id: 'section-review',
		number: 5,
		name: 'Review',
		description: 'Final review',
		required: true,
	},
]);

// Scroll to section
const scrollToSection = (sectionId: string) => {
	const element = document.getElementById(sectionId);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		activeSection.value = sectionId;
	}
};

// Ref to store the scroll container
const scrollContainer = ref<HTMLElement | null>(null);

// Function to find the scrollable parent
const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
	if (!element) return null;

	let parent = element.parentElement;
	while (parent) {
		const overflow = window.getComputedStyle(parent).overflow;
		const overflowY = window.getComputedStyle(parent).overflowY;

		if (overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll') {
			return parent;
		}
		parent = parent.parentElement;
	}
	return null;
};

// Scroll spy - track which section is visible
const handleScroll = () => {
	const threshold = 200; // Distance from top of viewport/container
	let closestSection = sections.value[0]?.id; // Default to first section
	let closestDistance = Infinity;

	// Get the viewport/container height
	const containerHeight =
		scrollContainer.value === (window as any)
			? (window as any).innerHeight
			: (scrollContainer.value as HTMLElement)?.clientHeight || (window as any).innerHeight;

	// Find the section that's closest to the threshold
	for (const section of sections.value) {
		const element = document.getElementById(section.id);
		if (element) {
			const rect = element.getBoundingClientRect();
			const distance = Math.abs(rect.top - threshold);

			// If this section's top is above the bottom of viewport and closer to threshold
			if (rect.top < containerHeight && rect.bottom > 0 && distance < closestDistance) {
				closestDistance = distance;
				closestSection = section.id;
			}
		}
	}

	if (closestSection && activeSection.value !== closestSection) {
		activeSection.value = closestSection;
	}
};

// Computed: Pricing
const currency_code = computed({
	get() {
		return formState.value.price_types?.[0]?.currency_code ?? 'MYR';
	},
	set(value) {
		if (formState.value.price_types?.[0]) {
			formState.value.price_types[0].currency_code = value;
		} else {
			formState.value.price_types = [{ id: undefined, orig_sell_price: 0, cost_price: undefined, sale_price: undefined, currency_code: value }];
		}
	},
});

const orig_sell_price = computed({
	get() {
		return formState.value.price_types?.[0]?.orig_sell_price ?? 0;
	},
	set(value) {
		if (formState.value.price_types?.[0]) {
			formState.value.price_types[0].orig_sell_price = value ?? 0;
		} else {
			formState.value.price_types = [
				{ id: undefined, orig_sell_price: value ?? 0, cost_price: undefined, sale_price: undefined, currency_code: currency_code.value },
			];
		}
	},
});

const cost_price = computed({
	get() {
		return formState.value.price_types?.[0]?.cost_price;
	},
	set(value) {
		if (formState.value.price_types?.[0]) {
			formState.value.price_types[0].cost_price = value;
		} else {
			formState.value.price_types = [{ id: undefined, cost_price: value, orig_sell_price: 0, sale_price: undefined, currency_code: currency_code.value }];
		}
	},
});

const sale_price = computed({
	get() {
		return formState.value.price_types?.[0]?.sale_price;
	},
	set(value) {
		if (formState.value.price_types?.[0]) {
			formState.value.price_types[0].sale_price = value;
		} else {
			formState.value.price_types = [{ id: undefined, sale_price: value, orig_sell_price: 0, cost_price: undefined, currency_code: currency_code.value }];
		}
	},
});

// Methods: Images
const updateImages = (files: File[]) => {
	formState.value.images = files;
};

const deleteImage = (image: Image) => {
	if (!formState.value.images) return;

	const index = formState.value.images.findIndex((img) => (img as Image).id === image.id);
	if (index !== -1) {
		formState.value.images.splice(index, 1);
	}
};

const updateThumbnail = (files: File[]) => {
	formState.value.thumbnail = files[0];
};

const deleteThumbnail = () => {
	formState.value.thumbnail = undefined;
};
// Methods: Currency
const updateCurrency = (currency: any) => {
	currency_code.value = currency.code;
};

// Methods: Product Options & Variants
const updateProductOptions = (value: ProductOptionInput[]) => {
	formState.value.options = value;
};

const updateProductVariants = (value: ProductVariantInput[]) => {
	formState.value.variants = value;
};

const updateProductMetadata = (value: any) => {
	formState.value.metadata = value;
};

// Methods: Form Submission
const onSubmit = async () => {
	// Update category_codes, tag_ids, brand_codes from UI state
	formState.value.category_codes = categories.value?.map((cat) => cat.code!).filter(Boolean) ?? [];
	formState.value.tag_ids = tags.value?.map((tag) => tag.id!).filter(Boolean);
	formState.value.brand_codes = brands.value?.map((brand) => brand.code!).filter(Boolean);
	formState.value.status = ProductStatus.PUBLISHED;

	// Deep clone metadata to avoid reference issues
	if (formState.value.metadata) {
		formState.value.metadata = JSON.parse(JSON.stringify(formState.value.metadata));
	}

	const overlay = useOverlay();
	const loadingModal = overlay.create(ZModalLoading, {
		props: { key: 'loading' },
	});

	loadingModal.open();

	try {
		const productStore = useProductStore();
		const success = await productStore.updateProduct(formState.value);
		if (success) {
			useRouter().back();
		}
	} catch (error) {
		console.error(error);
	} finally {
		loadingModal.close();
	}
};

// Lifecycle: Setup scroll spy
onMounted(() => {
	// Find the scrollable container - likely the UDashboardPanel body
	nextTick(() => {
		// Try to find scrollable parent from component root
		const root = document.getElementById('section-basic-info')?.parentElement?.parentElement;

		const foundScrollable = findScrollableParent(root as HTMLElement);

		scrollContainer.value = foundScrollable || (window as any);

		if (scrollContainer.value) {
			scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true });

			handleScroll(); // Initial check
		}
	});
});

// Expose methods to parent component
defineExpose({
	onSubmit,
});

// Lifecycle: Cleanup
onUnmounted(() => {
	if (scrollContainer.value) {
		scrollContainer.value.removeEventListener('scroll', handleScroll);
	}
});
</script>

<style scoped>
/* Smooth scroll behavior */
html {
	scroll-behavior: smooth;
}

/* Ensure proper spacing for mobile */
@media (max-width: 640px) {
	.space-y-6 > * + * {
		margin-top: 1.5rem;
	}
}
</style>
