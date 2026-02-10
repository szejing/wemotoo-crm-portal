<template>
	<div class="w-full">
		<!-- Auto-save indicator -->
		<div v-if="lastSaved" class="text-sm text-neutral-600 text-right mb-4 px-2">
			<UIcon :name="ICONS.CHECK_ROUNDED" class="inline-block w-4 h-4 text-green-500" />
			{{ $t('components.productForm.draftSavedAt', { time: lastSaved }) }}
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
				<UForm :schema="CreateProductValidation" :state="new_product" class="space-y-6 mb-6" @submit="onSubmit">
					<!-- Section 1: Basic Information -->
					<UCard id="section-basic-info" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.INFO" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">{{ $t('components.productUpdate.basicInformation') }}</h2>
										<span class="text-red-500 text-sm">*</span>
									</div>
									<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.essentialProductDetails') }}</p>
								</div>
								<UTooltip :text="$t('pages.essentialInfoTooltip')" :popper="{ placement: 'bottom' }">
									<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-5 h-5 cursor-help" />
								</UTooltip>
							</div>
						</template>

						<div class="space-y-6 p-4 sm:p-6">
							<!-- Product Basic Fields -->
							<div class="space-y-4">
								<div class="w-full flex justify-end">
									<UFormField :label="$t('components.productUpdate.productCode')">
										<USwitch
											v-model="new_product.is_active"
											:label="
												$t('components.productUpdate.currentStatusLabel', {
													status: new_product.is_active ? $t('components.productUpdate.statusActive') : $t('components.productUpdate.statusDisabled'),
												})
											"
										/>
									</UFormField>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField :label="$t('components.productUpdate.productCode')">
										<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.uniqueIdentifier') }}</p>
										<UInput
											v-model="new_product.code"
											:placeholder="$t('components.productUpdate.productCodePlaceholder')"
											@update:model-value="new_product.code = $event.toUpperCase()"
										/>
									</UFormField>
									<UFormField :label="$t('components.productUpdate.productName')" required>
										<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.nameCustomersSee') }}</p>
										<UInput v-model="new_product.name" :placeholder="$t('components.productUpdate.productNamePlaceholder')" />
									</UFormField>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField :label="$t('components.productUpdate.shortDescription')">
										<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.briefDescription') }}</p>
										<UInput v-model="new_product.short_desc" :placeholder="$t('components.productUpdate.shortDescPlaceholder')" />
									</UFormField>
									<UFormField :label="$t('components.productUpdate.productType')" required>
										<p class="text-xs text-neutral-500 my-1">{{ $t('pages.chooseItemOrService') }}</p>
										<ZSelectMenuProductType v-model:type-id="new_product.type_id" class="w-full" />
									</UFormField>
								</div>
							</div>

							<hr class="my-6" />

							<!-- Product Images -->
							<div class="space-y-4">
								<h3 class="text-lg font-semibold">{{ $t('components.productUpdate.productImages') }}</h3>
								<div class="flex flex-col gap-6 sm:flex-row sm:justify-between">
									<div class="flex flex-col w-full">
										<div class="flex items-center gap-2 mb-2">
											<h4 class="text-md font-medium">{{ $t('components.productUpdate.thumbnail') }}</h4>
											<UTooltip :text="$t('pages.mainImageTooltip')" :popper="{ placement: 'right' }">
												<UIcon :name="ICONS.HELP" class="text-neutral-400 w-4 h-4 cursor-help" />
											</UTooltip>
										</div>
										<p class="text-xs text-neutral-500 mb-3">{{ $t('components.productUpdate.recommendedRatio') }}</p>
										<ZDropzone
											class="max-w-full sm:max-w-[250px]"
											:existing-images="new_product.thumbnail ? [new_product.thumbnail] : []"
											@files-selected="updateThumbnail"
										/>
									</div>

									<div class="flex flex-col w-full">
										<div class="flex items-center gap-2 mb-2">
											<h4 class="text-md font-medium">{{ $t('components.productUpdate.additionalImages') }}</h4>
											<UTooltip :text="$t('pages.moreImagesTooltip')" :popper="{ placement: 'right' }">
												<UIcon :name="ICONS.HELP" class="text-neutral-400 w-4 h-4 cursor-help" />
											</UTooltip>
										</div>
										<p class="text-xs text-neutral-500 mb-3">{{ $t('components.productUpdate.max3Images') }}</p>
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
					<ZInputProductClassificationSection
						v-model:categories="categories"
						v-model:tags="tags"
						v-model:brands="brands"
					/>

					<!-- Section 3: Pricing -->
					<ZInputProductPricingSection
						:currency-code="currency_code"
						:orig-sell-price="orig_sell_price"
						:cost-price="cost_price"
						:sale-price="sale_price"
						@update:currency="updateCurrency"
						@update:orig-sell-price="orig_sell_price = $event ?? 0"
						@update:cost-price="cost_price = $event"
						@update:sale-price="sale_price = $event"
					/>

					<!-- Section 4: Variants (only show for physical items) -->
					<UCard id="section-variants" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">{{ $t('components.productUpdate.productVariants') }}</h2>
										<span class="text-xs text-neutral-500 ml-2">({{ $t('components.productUpdate.optional') }})</span>
									</div>
									<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.addOptionsVariations') }}</p>
								</div>
								<UTooltip :text="$t('components.productUpdate.variantsTooltip')" :popper="{ placement: 'bottom' }">
									<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-5 h-5 cursor-help" />
								</UTooltip>
							</div>
						</template>

						<div class="p-4 sm:p-6">
							<div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
								<div class="flex items-start gap-3">
									<UIcon :name="ICONS.INFO" class="text-purple-600 w-5 h-5 mt-0.5 shrink-0" />
									<div>
										<h4 class="text-sm font-medium text-purple-900">{{ $t('components.productUpdate.productVariants') }}</h4>
										<p class="text-xs text-purple-700 mt-1">{{ $t('components.productUpdate.variantsTooltip') }}</p>
									</div>
								</div>
							</div>

							<ZInputProductAdditionalInfo
								:product="new_product"
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
										<h2 class="text-xl font-semibold">{{ $t('components.productUpdate.reviewYourProduct') }}</h2>
									</div>
									<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.reviewBeforeCreate') }}</p>
								</div>
							</div>
						</template>

						<div class="p-4 sm:p-6 space-y-4">
							<div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
								<div class="flex items-start gap-3">
									<UIcon :name="ICONS.CHECK_ROUNDED" class="text-primary-600 w-5 h-5 mt-0.5 shrink-0" />
									<div>
										<h4 class="text-sm font-medium text-primary-900">{{ $t('components.productUpdate.readyToCreate') }}</h4>
										<p class="text-xs text-primary-700 mt-1">{{ $t('components.productUpdate.reviewBeforeSubmit') }}</p>
									</div>
								</div>
							</div>

							<!-- Quick Summary Cards -->
							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<!-- Basic Info Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.INFO" class="text-primary-500 w-4 h-4" />
										{{ $t('pages.basicInfo') }}
									</h4>
									<div class="text-sm space-y-1">
										<p class="truncate">
											<span class="text-neutral-500">{{ $t('common.name') }}:</span>
											<span class="font-medium">{{ new_product.name || $t('common.notSet') }}</span>
										</p>
										<p class="truncate">
											<span class="text-neutral-500">{{ $t('common.code') }}:</span>
											<span class="font-medium">{{ new_product.code || $t('common.auto') }}</span>
										</p>
										<p>
											<UBadge :color="new_product.is_active ? 'success' : 'error'" variant="soft" size="xs">
												{{ new_product.is_active ? $t('common.active') : $t('common.inactive') }}
											</UBadge>
										</p>
									</div>
								</div>

								<!-- Pricing Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.CURRENCY" class="text-primary-500 w-4 h-4" />
										{{ $t('components.productUpdate.pricing') }}
									</h4>
									<div class="text-sm space-y-1">
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.priceLabel') }}:</span>
											<span class="font-bold">{{ currency_code }} {{ orig_sell_price?.toFixed(2) || '0.00' }}</span>
										</p>
										<p v-if="sale_price">
											<span class="text-neutral-500">{{ $t('components.productUpdate.sale') }}:</span>
											<span class="font-bold text-green-600">{{ currency_code }} {{ sale_price.toFixed(2) }}</span>
										</p>
										<p v-if="cost_price">
											<span class="text-neutral-500">{{ $t('components.productUpdate.cost') }}:</span>
											<span class="font-medium">{{ currency_code }} {{ cost_price.toFixed(2) }}</span>
										</p>
									</div>
								</div>

								<!-- Classification Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.TAG" class="text-primary-500 w-4 h-4" />
										{{ $t('components.productUpdate.classification') }}
									</h4>
									<div class="text-sm space-y-1">
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.categoriesLabel') }}:</span>
											<span class="font-medium">{{ categories?.length || 0 }}</span>
										</p>
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.tagsLabel') }}:</span>
											<span class="font-medium">{{ tags?.length || 0 }}</span>
										</p>
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.brandsLabel') }}:</span>
											<span class="font-medium">{{ brands?.length || 0 }}</span>
										</p>
									</div>
								</div>

								<!-- Variants Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-4 h-4" />
										{{ $t('components.productUpdate.variantsSummaryTitle') }}
									</h4>
									<div class="text-sm">
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.total') }}:</span>
											<span class="font-medium">{{ new_product.variants?.length || 0 }}</span>
										</p>
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.options') }}:</span>
											<span class="font-medium">{{ new_product.options?.length || 0 }}</span>
										</p>
									</div>
								</div>

								<!-- Images Summary -->
								<div class="bg-neutral-50 rounded-lg p-4">
									<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
										<UIcon :name="ICONS.IMAGE" class="text-primary-500 w-4 h-4" />
										{{ $t('components.productUpdate.imagesSummaryTitle') }}
									</h4>
									<div class="text-sm">
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.thumbnailLabel') }}:</span>
											<span class="font-medium">{{ new_product.thumbnail ? '✓' : '✗' }}</span>
										</p>
										<p>
											<span class="text-neutral-500">{{ $t('components.productUpdate.galleryLabel') }}:</span>
											<span class="font-medium">{{ new_product.images?.length || 0 }}</span>
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
import type { BrandInput, Brand } from '~/utils/types/brand';
import { CreateProductValidation } from '~/utils/schema';
import { ZModalLoading } from '#components';

// Store
const productStore = useProductStore();
const { new_product } = storeToRefs(productStore);
const toast = useToast();

// State
const saving = ref(false);
const lastSaved = ref<string | null>(null);
const autoSaveTimer = ref<NodeJS.Timeout | null>(null);
const activeSection = ref('section-basic-info');

// Categories, tags, brands state (for UI binding)
const categories = ref<Category[]>([]);
const tags = ref<Tag[]>([]);
const brands = ref<Brand[]>([]);

const { t } = useI18n();

// Section Navigation
const sections = computed(() => [
	{
		id: 'section-basic-info',
		number: 1,
		name: t('pages.basicInfo'),
		description: t('pages.basicInfoDesc'),
		required: true,
	},
	{
		id: 'section-classification',
		number: 2,
		name: t('pages.classification'),
		description: t('pages.classificationDesc'),
		required: false,
	},
	{
		id: 'section-pricing',
		number: 3,
		name: t('pages.pricing'),
		description: t('pages.pricingDesc'),
		required: true,
	},
	{ id: 'section-variants', number: 4, name: t('components.productUpdate.productVariants'), description: t('pages.productVariantsDesc'), required: false },
	{
		id: 'section-review',
		number: 5,
		name: t('pages.review'),
		description: t('pages.reviewDesc'),
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
				title: t('components.productForm.draftSaved'),
				description: t('components.productForm.draftSavedDescription', { time: lastSaved.value }),
				icon: ICONS.CHECK_ROUNDED,
				color: 'success',
			});
		}
	} catch (error) {
		console.error('Error saving draft:', error);
		if (!silent) {
			toast.add({
				title: t('components.productForm.errorTitle'),
				description: t('components.productForm.errorSavingDraft'),
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
};

const updateThumbnail = (files: File[]) => {
	new_product.value.thumbnail = files[0];
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

	const success = await productStore.createProduct();

	loadingModal.close();
	if (success) {
		useRouter().back();
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
	if (autoSaveTimer.value) {
		clearTimeout(autoSaveTimer.value);
	}
	if (scrollContainer.value) {
		scrollContainer.value.removeEventListener('scroll', handleScroll);
	}
});
</script>

<style scoped>
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
