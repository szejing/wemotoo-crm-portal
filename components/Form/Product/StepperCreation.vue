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
								<h3 class="step-title" :class="[currentStep >= step.id ? 'text-neutral-900' : 'text-neutral-500']">
									{{ step.name }}
									<span v-if="step.required" class="text-red-500">*</span>
								</h3>
								<p class="step-description">{{ step.description }}</p>
							</div>
						</div>
						<div v-if="index < steps.length - 1" class="mobile-step-connector" :class="[currentStep > step.id ? 'bg-green-500' : 'bg-neutral-300']"></div>
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
								<h3 class="step-title desktop-title" :class="[currentStep >= step.id ? 'text-neutral-900' : 'text-neutral-500']">
									{{ step.name }}
									<span v-if="step.required" class="text-red-500">*</span>
								</h3>
								<p class="desktop-step-description">{{ step.description }}</p>
							</div>
						</div>
						<div v-if="index < steps.length - 1" class="desktop-step-connector" :class="[currentStep > step.id ? 'bg-green-500' : 'bg-neutral-300']"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Step Content -->
		<UForm :schema="CreateProductValidation" :state="new_product" class="space-y-4" @submit="onSubmit">
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
					<p class="text-sm text-neutral-500 mt-1">{{ getCurrentStep()?.description }}</p>
				</template>

				<!-- Step 1: Images & Basic Info -->
				<div v-if="currentStep === 1" class="space-y-6">
					<ZInputProductGeneralInfo
						v-model:is-active="new_product.is_active"
						v-model:is-giftcard="new_product.is_giftcard"
						v-model:is-discountable="new_product.is_discountable"
						v-model:code="new_product.code"
						v-model:name="new_product.name"
						v-model:short-desc="new_product.short_desc"
						v-model:long-desc="new_product.long_desc"
						v-model:type="new_product.type"
						:card-ui="borderlessCardUi"
						hide-header
					/>

					<hr />

					<div class="flex flex-col justify-start items-start md:flex-row md:justify-between gap-4">
						<div class="flex flex-col w-full">
							<h3 class="text-lg font-medium">Thumbnail</h3>
							<p class="text-xs text-neutral-400">
								Recommended size: 1:1 <br />
								Image will be used as thumbnail
							</p>
							<ZDropzone class="mt-4 max-w-[250px]" :existing-images="new_product.thumbnail ? [new_product.thumbnail] : []" @files-selected="updateThumbnail" />
						</div>

						<div class="flex flex-col w-full">
							<h3 class="text-lg font-medium">Images</h3>
							<p class="text-xs text-neutral-400">
								Recommended size: 1:1 <br />
								Max 3 images, images will be used as product images
							</p>
							<ZDropzone multiple :max-images="3" class="mt-4 max-w-[250px]" :existing-images="new_product.images" @files-selected="updateImages" />
						</div>
					</div>
				</div>

				<!-- Step 2: Categories, Tags & Brands -->
				<div v-if="currentStep === 2" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<h3 class="text-lg font-medium mb-4">Categories</h3>
							<ZSelectMenuCategories v-model:categories="new_product.categories" />
						</div>

						<div>
							<h3 class="text-lg font-medium mb-4">Tags</h3>
							<ZSelectMenuTags v-model:tags="new_product.tags" />
						</div>

						<div>
							<h3 class="text-lg font-medium mb-4">Brands</h3>
							<ZSelectMenuBrands v-model:brands="new_product.brands" />
						</div>
					</div>

					<!-- <div>
					<h3 class="text-lg font-medium mb-4">Product Status</h3>
					<ZSelectMenuProductStatus v-model:status="new_product.status" />
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
						:product="new_product"
						:card-ui="borderlessCardUi"
						hide-header
						@update:options="updateProductOptions"
						@update:variants="updateProductVariants"
						@update:metadata="updateProductMetadata"
					/>
				</div>

				<template #footer>
					<div class="flex justify-between items-center">
						<UButton v-if="currentStep > 1" color="neutral" variant="outline" @click="previousStep"> Previous </UButton>
						<div v-else></div>

						<div class="flex space-x-3">
							<UButton color="neutral" variant="ghost" :loading="saving" @click="saveDraft"> Save as Draft </UButton>
							<UButton v-if="currentStep < 4" color="primary" @click="nextStep"> Next Step </UButton>
							<UButton v-else color="success" :loading="adding" type="submit"> Create Product </UButton>
						</div>
					</div>
				</template>
			</UCard>
		</UForm>
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
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateProductValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductValidation>;
const productStore = useProductStore();
const { new_product, adding } = storeToRefs(productStore);

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
		return new_product.value.price_types?.[0]?.currency_code ?? 'MYR';
	},
	set(value) {
		if (new_product.value.price_types && new_product.value.price_types.length > 0) {
			new_product.value.price_types[0].currency_code = value;
		} else {
			new_product.value.price_types = [
				{ id: undefined, orig_sell_price: orig_sell_price.value, cost_price: cost_price.value, sale_price: sale_price.value, currency_code: value },
			];
		}
	},
});

const orig_sell_price = computed({
	get() {
		return new_product.value.price_types?.[0]?.orig_sell_price ?? undefined;
	},
	set(value) {
		if (new_product.value.price_types && new_product.value.price_types.length > 0) {
			new_product.value.price_types[0].orig_sell_price = value;
		} else {
			new_product.value.price_types = [
				{ id: undefined, orig_sell_price: value, cost_price: cost_price.value, sale_price: sale_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const cost_price = computed({
	get() {
		return new_product.value.price_types?.[0]?.cost_price ?? undefined;
	},
	set(value) {
		if (new_product.value.price_types && new_product.value.price_types.length > 0) {
			new_product.value.price_types[0].cost_price = value;
		} else {
			new_product.value.price_types = [
				{ id: undefined, cost_price: value, orig_sell_price: orig_sell_price.value, sale_price: sale_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const sale_price = computed({
	get() {
		return new_product.value.price_types?.[0]?.sale_price ?? undefined;
	},
	set(value) {
		if (new_product.value.price_types && new_product.value.price_types.length > 0) {
			new_product.value.price_types[0].sale_price = value;
		} else {
			new_product.value.price_types = [
				{ id: undefined, sale_price: value, orig_sell_price: orig_sell_price.value, cost_price: cost_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const getStepClass = (id: number) => {
	if (currentStep.value === id) return 'bg-primary-500 border-primary-500 text-white';
	if (currentStep.value > id) return 'bg-green-500 border-green-500 text-white';
	return 'bg-white border-neutral-300 text-neutral-500';
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
	new_product.value.images = files;
};

const updateThumbnail = (files: File[]) => {
	new_product.value.thumbnail = files[0];
};

const updateProductOptions = (value: ProdOptionInput[]) => {
	new_product.value.options = value;
};

const updateProductVariants = (value: ProdVariantInput[]) => {
	new_product.value.variants = value;
};

const updateProductMetadata = (value: any) => {
	new_product.value.metadata = value;
};
const saveDraft = async () => {
	saving.value = true;
	try {
		new_product.value.status = ProductStatus.DRAFT;
		// Could implement a separate draft save API call here
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
	} finally {
		saving.value = false;
	}
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event.data);
	// Clear variants if not needed
	new_product.value.options = [];
	new_product.value.variants = [];

	// Process the data same as original form
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
	new_product.value.categories?.forEach((category) => {
		prodCategories.push({
			code: category.code!,
		});
	});

	const prodTags: TagInput[] = [];
	new_product.value.tags?.forEach((tag) => {
		prodTags.push({
			id: tag.id!,
		});
	});

	const prodOptions: ProdOptionInput[] = [];
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

	const prodVariants: ProdVariantInput[] = [];
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

	const brands: BrandInput[] = [];
	new_product.value.brands?.forEach((brand) => {
		brands.push({ code: brand.code! });
	});

	new_product.value.is_discountable = true;
	new_product.value.is_giftcard = false;
	new_product.value.price_types = prodPrice;
	new_product.value.categories = prodCategories;
	new_product.value.tags = prodTags;
	new_product.value.brands = brands;
	new_product.value.status = new_product.value.status || ProductStatus.DRAFT;
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
			navigateTo('/products');
		}
	} catch (error) {
		console.error(error);
	} finally {
		loadingModal.close();
	}
};

const goToStep = (id: number) => {
	currentStep.value = id;
};
</script>

<style scoped>
/* Mobile Stepper Styles */
.mobile-stepper-container {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 0.5rem;
}

.mobile-step-wrapper {
	display: flex;
	align-items: flex-start;
	flex: 1;
}

.mobile-step-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	width: 100%;
}

.mobile-step-text {
	cursor: pointer;
	width: 100%;
}

.mobile-step-connector {
	width: 1rem;
	height: 0.125rem;
	margin-top: 1rem;
	margin-left: 0.25rem;
	margin-right: 0.25rem;
	flex-shrink: 0;
	transition: color 150ms;
}

/* Desktop Stepper Styles */
.desktop-stepper-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.desktop-step-wrapper {
	display: flex;
	align-items: center;
	flex: 1;
}

.desktop-step-content {
	display: flex;
	align-items: center;
}

.desktop-step-text {
	margin-left: 0.75rem;
	min-width: 0;
	cursor: pointer;
}

.desktop-step-connector {
	flex: 1;
	height: 0.125rem;
	margin-left: 1rem;
	margin-right: 1rem;
	transition: color 150ms;
}

/* Common Step Styles */
.step-circle {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 9999px;
	border-width: 2px;
	transition: all 150ms;
	cursor: pointer;
	margin-bottom: 0.5rem;
	width: 2rem;
	height: 2rem;
}

.step-circle:hover {
	background-color: var(--color-neutral-50);
	color: var(--color-primary-500);
	border-color: var(--color-primary-500);
}

.desktop-circle {
	margin-bottom: 0;
	width: 2.5rem;
	height: 2.5rem;
}

.step-icon {
	width: 1rem;
	height: 1rem;
}

.desktop-step-icon {
	width: 1.25rem;
	height: 1.25rem;
}

.step-number {
	font-size: 0.75rem;
	line-height: 1rem;
	font-weight: 500;
}

.desktop-step-number {
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 500;
}

.step-title {
	font-weight: 700;
	margin-bottom: 0.25rem;
}

.desktop-title {
	white-space: nowrap;
}

.step-description {
	font-size: 0.75rem;
	line-height: 1rem;
	color: var(--color-neutral-500);
	line-height: 1.25;
	overflow-wrap: break-word;
}

.desktop-step-description {
	font-size: 0.75rem;
	line-height: 1rem;
	color: var(--color-neutral-500);
}

/* Legacy styles for backward compatibility */
.step-indicator {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.step-line {
	flex: 1;
	height: 0.125rem;
	background-color: var(--color-neutral-300);
}

.step-line.completed {
	background-color: var(--color-green-500);
}
</style>
