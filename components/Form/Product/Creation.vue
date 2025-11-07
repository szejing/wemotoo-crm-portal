<template>
	<div class="w-full">
		<!-- Auto-save indicator -->
		<div v-if="lastSaved" class="text-sm text-neutral-600 text-right mb-4 px-2">
			<UIcon :name="ICONS.CHECK_ROUNDED" class="inline-block w-4 h-4 text-green-500" />
			Draft saved at {{ lastSaved }}
		</div>

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
									<p class="text-xs opacity-80 truncate">{{ section.description }}</p>
								</div>
							</div>
						</div>
					</nav>
				</div>
			</div>

			<!-- Right Content Area (Scrollable) -->
			<div class="lg:col-span-9">
				<!-- Single Form with all sections -->
				<UForm :schema="CreateProductValidation" :state="new_product" class="space-y-6 mb-6" @submit="onSubmit">
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
									<div class="flex items-center gap-2">
										<label class="text-sm font-medium">Active</label>
										<UCheckbox v-model="new_product.is_active" />
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField label="Product Code">
										<p class="text-xs text-neutral-500 my-1">Unique identifier for your product</p>
										<UInput v-model="new_product.code" placeholder="e.g., PROD-001 (auto-generated if empty)" />
									</UFormField>
									<UFormField label="Product Name" required>
										<p class="text-xs text-neutral-500 my-1">The name customers will see</p>
										<UInput v-model="new_product.name" placeholder="e.g., Chicken Rice Set" />
									</UFormField>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField label="Short Description">
										<p class="text-xs text-neutral-500 my-1">Brief description for product listings</p>
										<UInput v-model="new_product.short_desc" placeholder="e.g., Delicious chicken rice with soup" />
									</UFormField>
									<UFormField label="Product Type" required>
										<p class="text-xs text-neutral-500 my-1">Choose 'Item' for physical products, 'Service' for services</p>
										<ZSelectMenuProductType v-model:type-id="new_product.type_id" class="w-full" />
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
											:existing-images="new_product.thumbnail ? [new_product.thumbnail] : []"
											@files-selected="updateThumbnail"
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
											:existing-images="new_product.images"
											@files-selected="updateImages"
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

								<UFormField label="Currency">
									<p class="text-xs text-neutral-500 my-1">Currency</p>
									<ZSelectMenuCurrency :currency-code="currency_code" @update:currency="updateCurrency" />
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
					<UCard v-if="!shouldSkipVariants()" id="section-variants" class="shadow-md scroll-mt-4">
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
								:product="new_product"
								:card-ui="borderlessCardUi"
								hide-header
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
											<span class="text-neutral-500">Name:</span> <span class="font-medium">{{ new_product.name || 'Not set' }}</span>
										</p>
										<p class="truncate">
											<span class="text-neutral-500">Code:</span> <span class="font-medium">{{ new_product.code || 'Auto' }}</span>
										</p>
										<p>
											<UBadge :color="new_product.is_active ? 'success' : 'error'" variant="soft" size="xs">
												{{ new_product.is_active ? 'Active' : 'Inactive' }}
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
								<div v-if="!shouldSkipVariants()" class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-4 h-4" />
										Variants
									</h4>
									<div class="text-sm">
										<p>
											<span class="text-neutral-500">Total:</span> <span class="font-medium">{{ new_product.variants?.length || 0 }}</span>
										</p>
										<p>
											<span class="text-neutral-500">Options:</span> <span class="font-medium">{{ new_product.options?.length || 0 }}</span>
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
											<span class="text-neutral-500">Thumbnail:</span> <span class="font-medium">{{ new_product.thumbnail ? '✓' : '✗' }}</span>
										</p>
										<p>
											<span class="text-neutral-500">Gallery:</span> <span class="font-medium">{{ new_product.images?.length || 0 }}</span>
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
import type { CategoryInput, Category } from '~/utils/types/category';
import type { PriceInput } from '~/utils/types/price';
import type { ProductOptionInput, ProductVariantInput } from '~/utils/types/product';
import type { TagInput, Tag } from '~/utils/types/tag';
import { ZModalLoading } from '#components';
import type { BrandInput, Brand } from '~/utils/types/brand';
import { CreateProductValidation } from '~/utils/schema';

// Store
const productStore = useProductStore();
const { new_product } = storeToRefs(productStore);
const toast = useToast();

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
const saving = ref(false);
const lastSaved = ref<string | null>(null);
const autoSaveTimer = ref<NodeJS.Timeout | null>(null);
const activeSection = ref('section-basic-info');

// Categories, tags, brands state (for UI binding)
const categories = ref<Category[]>([]);
const tags = ref<Tag[]>([]);
const brands = ref<Brand[]>([]);

// UI Configuration
const borderlessCardUi = {
	body: { padding: 'py-0' },
	header: { padding: 'py-0' },
	ring: 'ring-0',
	shadow: 'shadow-none',
};

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
	...(shouldSkipVariants() ? [] : [{ id: 'section-variants', number: 4, name: 'Product Variants', description: 'Options & variations', required: false }]),
	{
		id: 'section-review',
		number: shouldSkipVariants() ? 4 : 5,
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

// Scroll spy - track which section is visible
const handleScroll = () => {
	const scrollPosition = window.scrollY + 100; // Offset for better UX

	for (const section of sections.value) {
		const element = document.getElementById(section.id);
		if (element) {
			const { offsetTop, offsetHeight } = element;
			if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
				activeSection.value = section.id;
				break;
			}
		}
	}
};

// Computed: Pricing
const currency_code = computed({
	get() {
		return new_product.value.price_types?.[0]?.currency_code ?? 'MYR';
	},
	set(value) {
		if (new_product.value.price_types?.[0]) {
			new_product.value.price_types[0].currency_code = value;
		} else {
			new_product.value.price_types = [{ id: undefined, orig_sell_price: 0, cost_price: undefined, sale_price: undefined, currency_code: value }];
		}
	},
});

const orig_sell_price = computed({
	get() {
		return new_product.value.price_types?.[0]?.orig_sell_price ?? 0;
	},
	set(value) {
		if (new_product.value.price_types?.[0]) {
			new_product.value.price_types[0].orig_sell_price = value ?? 0;
		} else {
			new_product.value.price_types = [
				{ id: undefined, orig_sell_price: value ?? 0, cost_price: undefined, sale_price: undefined, currency_code: currency_code.value },
			];
		}
	},
});

const cost_price = computed({
	get() {
		return new_product.value.price_types?.[0]?.cost_price;
	},
	set(value) {
		if (new_product.value.price_types?.[0]) {
			new_product.value.price_types[0].cost_price = value;
		} else {
			new_product.value.price_types = [{ id: undefined, cost_price: value, orig_sell_price: 0, sale_price: undefined, currency_code: currency_code.value }];
		}
	},
});

const sale_price = computed({
	get() {
		return new_product.value.price_types?.[0]?.sale_price;
	},
	set(value) {
		if (new_product.value.price_types?.[0]) {
			new_product.value.price_types[0].sale_price = value;
		} else {
			new_product.value.price_types = [{ id: undefined, sale_price: value, orig_sell_price: 0, cost_price: undefined, currency_code: currency_code.value }];
		}
	},
});

// Methods: Product Logic
const shouldSkipVariants = () => {
	// Skip variants section if product type is service (type_id === 2)
	return new_product.value.type_id === 2;
};

// Methods: Auto-save
const triggerAutoSave = async () => {
	if (autoSaveTimer.value) {
		clearTimeout(autoSaveTimer.value);
	}

	autoSaveTimer.value = setTimeout(async () => {
		await saveDraft(true);
	}, 3000);
};

const saveDraft = async (silent = false) => {
	saving.value = true;
	try {
		new_product.value.status = ProductStatus.DRAFT;
		// Simulate API call - replace with actual draft save logic
		await new Promise((resolve) => setTimeout(resolve, 500));

		const now = new Date();
		lastSaved.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

		if (!silent) {
			toast.add({
				title: 'Draft Saved',
				description: `Draft saved at ${lastSaved.value}`,
				icon: ICONS.CHECK_ROUNDED,
				color: 'success',
			});
		}
	} catch (error) {
		console.error('Error saving draft:', error);
		if (!silent) {
			toast.add({
				title: 'Error',
				description: 'Failed to save draft',
				color: 'error',
			});
		}
	} finally {
		saving.value = false;
	}
};

// Methods: Images
const updateImages = (files: File[]) => {
	new_product.value.images = files;
	triggerAutoSave();
};

const updateThumbnail = (files: File[]) => {
	new_product.value.thumbnail = files[0];
	triggerAutoSave();
};

// Methods: Currency
const updateCurrency = (currency: any) => {
	currency_code.value = currency.code;
};

// Methods: Product Options & Variants
const updateProductOptions = (value: ProductOptionInput[]) => {
	new_product.value.options = value;
	triggerAutoSave();
};

const updateProductVariants = (value: ProductVariantInput[]) => {
	new_product.value.variants = value;
	triggerAutoSave();
};

const updateProductMetadata = (value: any) => {
	new_product.value.metadata = value;
	triggerAutoSave();
};

// Methods: Form Submission
const onSubmit = async () => {
	// Clear variants if not needed
	if (shouldSkipVariants()) {
		new_product.value.options = [];
		new_product.value.variants = [];
	}

	// Process the data
	const prodPrice: PriceInput[] = [];
	new_product.value.price_types?.forEach((price) => {
		prodPrice.push({
			id: undefined,
			orig_sell_price: price.orig_sell_price,
			cost_price: price.cost_price,
			sale_price: price.sale_price,
			currency_code: price.currency_code,
		});
	});

	const prodCategories: CategoryInput[] = [];
	categories.value?.forEach((category: Category) => {
		prodCategories.push({
			code: category.code!,
		});
	});

	const prodTags: TagInput[] = [];
	tags.value?.forEach((tag: Tag) => {
		prodTags.push({
			id: tag.id!,
		});
	});

	const prodOptions: ProductOptionInput[] = [];
	new_product.value.options?.forEach((option) => {
		prodOptions.push({
			id: option.id!,
			name: option.name!,
			values: option.values?.map((value) => {
				return {
					id: value.id!,
					value: value.value!,
				};
			}),
		});
	});

	const prodVariants: ProductVariantInput[] = [];
	new_product.value.variants?.forEach((variant) => {
		prodVariants.push({
			variant_code: variant.variant_code!,
			product_code: variant.product_code!,
			name: variant.name!,
			price_types: variant.price_types?.map((price) => {
				return {
					id: undefined,
					orig_sell_price: price.orig_sell_price,
					cost_price: price.cost_price,
					sale_price: price.sale_price,
					currency_code: price.currency_code,
				};
			}),
			options: variant.options?.map((option) => {
				return {
					id: option.id!,
					option_id: option.option_id!,
					value: option.value!,
				};
			}),
		});
	});

	const prodBrands: BrandInput[] = [];
	brands.value?.forEach((brand: Brand) => {
		prodBrands.push({ code: brand.code! });
	});

	new_product.value.price_types = prodPrice;
	new_product.value.category_codes = prodCategories.map((c) => c.code!);
	new_product.value.tag_ids = prodTags.map((t) => t.id!);
	new_product.value.brand_codes = prodBrands.map((b) => b.code!);
	new_product.value.status = ProductStatus.PUBLISHED;
	new_product.value.options = prodOptions;
	new_product.value.variants = prodVariants;
	new_product.value.metadata = new_product.value.metadata ? JSON.parse(JSON.stringify(new_product.value.metadata)) : undefined;

	const overlay = useOverlay();
	const loadingModal = overlay.create(ZModalLoading, {
		props: {
			key: 'loading',
		},
	});

	loadingModal.open();

	try {
		const result = await productStore.createProduct();

		if (result) {
			toast.add({
				title: 'Success!',
				description: 'Product created successfully',
				icon: ICONS.CHECK_ROUNDED,
				color: 'success',
			});
			navigateTo('/products');
		}
	} catch (error) {
		console.error(error);
		toast.add({
			title: 'Error',
			description: 'Failed to create product',
			color: 'error',
		});
	} finally {
		loadingModal.close();
	}
};

// Lifecycle: Auto-save on product changes
watch(
	() => new_product.value,
	() => {
		if (autoSaveTimer.value) {
			clearTimeout(autoSaveTimer.value);
		}
		autoSaveTimer.value = setTimeout(() => {
			saveDraft(true);
		}, 3000);
	},
	{ deep: true },
);

// Lifecycle: Setup scroll spy
onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true });
	handleScroll(); // Initial check
});

// Lifecycle: Cleanup
onUnmounted(() => {
	if (autoSaveTimer.value) {
		clearTimeout(autoSaveTimer.value);
	}
	window.removeEventListener('scroll', handleScroll);
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
