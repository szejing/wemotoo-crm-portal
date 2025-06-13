<template>
	<div class="w-full">
		<!-- Stepper Header -->
		<div class="mb-8">
			<!-- Mobile: Horizontal Stepper with Vertical Content -->
			<div class="md:hidden">
				<div class="mobile-stepper-container">
					<div v-for="(step, index) in steps" :key="step.id" class="mobile-step-wrapper">
						<div class="mobile-step-content">
							<div class="step-circle" :class="[getStepClass(step.id)]" @click="goToStep(step.id)">
								<UIcon v-if="currentStep > step.id" :name="ICONS.CHECK_ROUNDED" class="step-icon" />
								<span v-else class="step-number">{{ step.id }}</span>
							</div>
							<div class="mobile-step-text" @click="goToStep(step.id)">
								<h3 class="step-title" :class="[currentStep >= step.id ? 'text-gray-900' : 'text-gray-500']">
									{{ step.name }}
									<span v-if="step.required" class="text-red-500">*</span>
								</h3>
								<p class="step-description">{{ step.description }}</p>
							</div>
						</div>
						<div v-if="index < steps.length - 1" class="mobile-step-connector" :class="[currentStep > step.id ? 'bg-green-500' : 'bg-gray-300']"></div>
					</div>
				</div>
			</div>

			<!-- Desktop: Horizontal Stepper -->
			<div class="hidden md:block">
				<div class="desktop-stepper-container">
					<div v-for="(step, index) in steps" :key="step.id" class="desktop-step-wrapper">
						<div class="desktop-step-content">
							<div class="step-circle desktop-circle" :class="[getStepClass(step.id)]" @click="goToStep(step.id)">
								<UIcon v-if="currentStep > step.id" :name="ICONS.CHECK_ROUNDED" class="desktop-step-icon" />
								<span v-else class="desktop-step-number">{{ step.id }}</span>
							</div>
							<div class="desktop-step-text" @click="goToStep(step.id)">
								<h3 class="step-title desktop-title" :class="[currentStep >= step.id ? 'text-gray-900' : 'text-gray-500']">
									{{ step.name }}
									<span v-if="step.required" class="text-red-500">*</span>
								</h3>
								<p class="desktop-step-description">{{ step.description }}</p>
							</div>
						</div>
						<div v-if="index < steps.length - 1" class="desktop-step-connector" :class="[currentStep > step.id ? 'bg-green-500' : 'bg-gray-300']"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Step Content -->
		<UCard
			class="min-h-[500px] max-w-[100%] sm:max-w-[100%] md:max-w-[80%] lg:max-w-[80%] mx-auto flex flex-col"
			:ui="{
				base: 'flex flex-col h-full',
				body: { base: 'flex-1', padding: 'px-4' },
				header: { padding: 'px-4 py-4' },
				footer: { padding: 'px-4 py-4' },
				ring: 'ring-0',
				shadow: 'shadow-lg',
			}"
		>
			<template #header>
				<h2 class="text-xl font-semibold">{{ getCurrentStep()?.name }}</h2>
				<p class="text-sm text-gray-500 mt-1">{{ getCurrentStep()?.description }}</p>
			</template>

			<!-- Step 1: Images & Basic Info -->
			<div v-if="currentStep === 1" class="space-y-6">
				<ZInputProductGeneralInfo
					v-model:is-active="newProduct.is_active"
					v-model:is-giftcard="newProduct.is_giftcard"
					v-model:is-discountable="newProduct.is_discountable"
					v-model:code="newProduct.code"
					v-model:name="newProduct.name"
					v-model:short-desc="newProduct.short_desc"
					v-model:long-desc="newProduct.long_desc"
					v-model:type="newProduct.type"
					:card-ui="borderlessCardUi"
					hide-header
				/>

				<hr />

				<div class="flex flex-col justify-start items-start md:flex-row md:justify-between gap-4">
					<div class="flex flex-col w-full">
						<h3 class="text-lg font-medium">Thumbnail</h3>
						<p class="text-xs text-gray-400">
							Recommended size: 1:1 <br />
							Image will be used as thumbnail
						</p>
						<ZDropzone class="mt-4 max-w-[250px]" :existing-images="newProduct.thumbnail ? [newProduct.thumbnail] : []" @files-selected="updateThumbnail" />
					</div>

					<div class="flex flex-col w-full">
						<h3 class="text-lg font-medium">Images</h3>
						<p class="text-xs text-gray-400">
							Recommended size: 1:1 <br />
							Max 3 images, images will be used as product images
						</p>
						<ZDropzone multiple :max-images="3" class="mt-4 max-w-[250px]" :existing-images="newProduct.images" @files-selected="updateImages" />
					</div>
				</div>
			</div>

			<!-- Step 2: Categories, Tags & Brands -->
			<div v-if="currentStep === 2" class="space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h3 class="text-lg font-medium mb-4">Categories</h3>
						<ZSelectMenuCategories v-model:categories="newProduct.categories" />
					</div>

					<div>
						<h3 class="text-lg font-medium mb-4">Tags</h3>
						<ZSelectMenuTags v-model:tags="newProduct.tags" />
					</div>

					<div>
						<h3 class="text-lg font-medium mb-4">Brands</h3>
						<ZSelectMenuBrands v-model:brands="newProduct.brands" />
					</div>
				</div>

				<!-- <div>
					<h3 class="text-lg font-medium mb-4">Product Status</h3>
					<ZSelectMenuProductStatus v-model:status="newProduct.status" />
				</div> -->
			</div>

			<!-- Step 3: Pricing -->
			<div v-if="currentStep === 3" class="space-y-6">
				<ZInputPricing
					v-model:orig-sell-price.number="orig_sell_price"
					v-model:cost-price.number="cost_price"
					v-model:sale-price.number="sale_price"
					v-model:currency-code="currency_code"
					:card-ui="borderlessCardUi"
					hide-header
				/>
			</div>

			<!-- Step 4: Product Variants (Optional) -->
			<div v-if="currentStep === 4" class="space-y-6">
				<ZInputProductAdditionalInfo
					:product="newProduct"
					:card-ui="borderlessCardUi"
					hide-header
					@update:options="updateProductOptions"
					@update:variants="updateProductVariants"
					@update:metadata="updateProductMetadata"
				/>
			</div>

			<template #footer>
				<div class="flex justify-between items-center">
					<UButton v-if="currentStep > 1" color="gray" variant="outline" @click="previousStep"> Previous </UButton>
					<div v-else></div>

					<div class="flex space-x-3">
						<UButton color="gray" variant="ghost" :loading="saving" @click="saveDraft"> Save as Draft </UButton>

						<UButton v-if="currentStep < 4" color="primary" @click="nextStep"> Next Step </UButton>

						<UButton v-else color="green" :loading="adding" @click="createProduct"> Create Product </UButton>
					</div>
				</div>
			</template>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import { ProductStatus } from 'wemotoo-common';
import type { CategoryInput } from '~/utils/types/category';
import type { PriceInput } from '~/utils/types/price';
import type { ProdOptionInput, ProdVariantInput } from '~/utils/types/product';
import type { TagInput } from '~/utils/types/tag';
import { ZModalLoading } from '#components';
import type { BrandInput } from '~/utils/types/brand';

const productStore = useProductStore();
const { newProduct, adding } = storeToRefs(productStore);

const currentStep = ref(1);
const saving = ref(false);

const borderlessCardUi = {
	body: { padding: 'py-0' },
	header: { padding: 'py-0' },
	ring: 'ring-0',
	shadow: 'shadow-none',
};

const steps = [
	{
		id: 1,
		name: 'Basic Info',
		description: 'Product basic information',
		required: true,
	},
	{
		id: 2,
		name: 'Classification',
		description: 'Categories, tags and brands',
		required: false,
	},
	{
		id: 3,
		name: 'Pricing',
		description: 'Product price types',
		required: true,
	},
	{
		id: 4,
		name: 'Additional Info',
		description: 'Product additional information',
		required: false,
	},
];

// Computed properties for pricing
const currency_code = computed({
	get() {
		return newProduct.value.price_types?.[0]?.currency_code ?? 'MYR';
	},
	set(value) {
		if (newProduct.value.price_types && newProduct.value.price_types.length > 0) {
			newProduct.value.price_types[0].currency_code = value;
		} else {
			newProduct.value.price_types = [
				{ id: undefined, orig_sell_price: orig_sell_price.value, cost_price: cost_price.value, sale_price: sale_price.value, currency_code: value },
			];
		}
	},
});

const orig_sell_price = computed({
	get() {
		return newProduct.value.price_types?.[0]?.orig_sell_price ?? undefined;
	},
	set(value) {
		if (newProduct.value.price_types && newProduct.value.price_types.length > 0) {
			newProduct.value.price_types[0].orig_sell_price = value;
		} else {
			newProduct.value.price_types = [
				{ id: undefined, orig_sell_price: value, cost_price: cost_price.value, sale_price: sale_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const cost_price = computed({
	get() {
		return newProduct.value.price_types?.[0]?.cost_price ?? undefined;
	},
	set(value) {
		if (newProduct.value.price_types && newProduct.value.price_types.length > 0) {
			newProduct.value.price_types[0].cost_price = value;
		} else {
			newProduct.value.price_types = [
				{ id: undefined, cost_price: value, orig_sell_price: orig_sell_price.value, sale_price: sale_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const sale_price = computed({
	get() {
		return newProduct.value.price_types?.[0]?.sale_price ?? undefined;
	},
	set(value) {
		if (newProduct.value.price_types && newProduct.value.price_types.length > 0) {
			newProduct.value.price_types[0].sale_price = value;
		} else {
			newProduct.value.price_types = [
				{ id: undefined, sale_price: value, orig_sell_price: orig_sell_price.value, cost_price: cost_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const getStepClass = (id: number) => {
	if (currentStep.value === id) return 'bg-primary-500 border-primary-500 text-white';
	if (currentStep.value > id) return 'bg-green-500 border-green-500 text-white';
	return 'bg-white border-gray-300 text-gray-500';
};

// Methods
const getCurrentStep = () => {
	return steps.find((step) => step.id === currentStep.value);
};

const nextStep = () => {
	if (currentStep.value < 4) {
		currentStep.value++;
	}
};

const previousStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
};

const updateImages = (files: File[]) => {
	newProduct.value.images = files;
};

const updateThumbnail = (files: File[]) => {
	newProduct.value.thumbnail = files[0];
};

const updateProductOptions = (value: ProdOptionInput[]) => {
	newProduct.value.options = value;
};

const updateProductVariants = (value: ProdVariantInput[]) => {
	newProduct.value.variants = value;
};

const updateProductMetadata = (value: any) => {
	newProduct.value.metadata = value;
};
const saveDraft = async () => {
	saving.value = true;
	try {
		newProduct.value.status = ProductStatus.DRAFT;
		// Could implement a separate draft save API call here
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
	} finally {
		saving.value = false;
	}
};

const createProduct = async () => {
	// Clear variants if not needed
	newProduct.value.options = [];
	newProduct.value.variants = [];

	// Process the data same as original form
	const prodPrice: PriceInput[] = [];
	newProduct.value.price_types?.forEach((price) => {
		prodPrice.push({
			id: undefined,
			orig_sell_price: price.orig_sell_price,
			cost_price: price.cost_price,
			sale_price: price.sale_price,
			currency_code: price.currency_code,
		});
	});

	const prodCategories: CategoryInput[] = [];
	newProduct.value.categories?.forEach((category) => {
		prodCategories.push({
			code: category.code!,
		});
	});

	const prodTags: TagInput[] = [];
	newProduct.value.tags?.forEach((tag) => {
		prodTags.push({
			id: tag.id!,
		});
	});

	const prodOptions: ProdOptionInput[] = [];
	newProduct.value.options?.forEach((option) => {
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

	const prodVariants: ProdVariantInput[] = [];
	newProduct.value.variants?.forEach((variant) => {
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

	const brands: BrandInput[] = [];
	newProduct.value.brands?.forEach((brand) => {
		brands.push({
			code: brand.code!,
		});
	});

	newProduct.value.is_discountable = true;
	newProduct.value.is_giftcard = false;
	newProduct.value.price_types = prodPrice;
	newProduct.value.categories = prodCategories;
	newProduct.value.tags = prodTags;
	newProduct.value.brands = brands;
	newProduct.value.status = newProduct.value.status || ProductStatus.DRAFT;
	newProduct.value.options = prodOptions;
	newProduct.value.variants = prodVariants;
	newProduct.value.metadata = newProduct.value.metadata ? JSON.parse(JSON.stringify(newProduct.value.metadata)) : undefined;

	const modal = useModal();
	modal.open(ZModalLoading, {
		key: 'loading',
	});

	try {
		const result = await productStore.createProduct();

		if (result) {
			navigateTo('/products');
		}
	} catch (error) {
		console.error(error);
	} finally {
		modal.close();
	}
};

const goToStep = (id: number) => {
	currentStep.value = id;
};
</script>

<style scoped lang="postcss">
/* Mobile Stepper Styles */
.mobile-stepper-container {
	@apply flex items-start justify-between gap-2;
}

.mobile-step-wrapper {
	@apply flex items-start flex-1;
}

.mobile-step-content {
	@apply flex flex-col items-center text-center w-full;
}

.mobile-step-text {
	@apply cursor-pointer w-full;
}

.mobile-step-connector {
	@apply w-4 h-0.5 mt-4 mx-1 flex-shrink-0 transition-colors;
}

/* Desktop Stepper Styles */
.desktop-stepper-container {
	@apply flex items-center justify-between;
}

.desktop-step-wrapper {
	@apply flex items-center flex-1;
}

.desktop-step-content {
	@apply flex items-center;
}

.desktop-step-text {
	@apply ml-3 min-w-0 cursor-pointer;
}

.desktop-step-connector {
	@apply flex-1 h-0.5 mx-4 transition-colors;
}

/* Common Step Styles */
.step-circle {
	@apply flex items-center justify-center rounded-full border-2 transition-colors cursor-pointer hover:bg-gray-50 hover:text-primary-500 hover:border-primary-500 mb-2;
	width: 2rem;
	height: 2rem;
}

.desktop-circle {
	@apply mb-0;
	width: 2.5rem;
	height: 2.5rem;
}

.step-icon {
	@apply w-4 h-4;
}

.desktop-step-icon {
	@apply w-5 h-5;
}

.step-number {
	@apply text-xs font-medium;
}

.desktop-step-number {
	@apply text-sm font-medium;
}

.step-title {
	@apply font-bold mb-1;
}

.desktop-title {
	@apply whitespace-nowrap;
}

.step-description {
	@apply text-xs text-gray-500 leading-tight break-words;
}

.desktop-step-description {
	@apply text-xs text-gray-500;
}

/* Legacy styles for backward compatibility */
.step-indicator {
	@apply flex items-center space-x-4;
}

.step-line {
	@apply flex-1 h-0.5 bg-gray-300;
}

.step-line.completed {
	@apply bg-green-500;
}
</style>
