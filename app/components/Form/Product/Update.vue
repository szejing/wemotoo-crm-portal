<template>
	<div class="w-full">
		<!-- Three Column Layout: Sidebar + Form + Sticky Review (laptop) -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<!-- Left Sidebar Navigation (Sticky) -->
			<div class="hidden lg:block lg:col-span-2">
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

			<!-- Center: Form Content (Scrollable) -->
			<div class="lg:col-span-7">
				<!-- Single Form with all sections -->
				<UForm ref="formRef" :schema="updateProductSchema" :state="formState" class="space-y-6 mb-6" @submit="onSubmit" @error="onError">
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
								<div class="w-full flex flex-wrap items-center gap-4 justify-between">
									<UFormField name="status" :label="$t('components.selectMenu.selectProductStatus')" class="min-w-0 flex-1 sm:flex-initial">
										<ZSelectMenuProductStatus v-model:status="formState.status" />
									</UFormField>
									<UFormField>
										<USwitch
											v-model="formState.is_active"
											:label="
												$t('components.productUpdate.currentStatusLabel', {
													status: formState.is_active ? $t('components.productUpdate.statusActive') : $t('components.productUpdate.statusDisabled'),
												})
											"
										/>
									</UFormField>
								</div>

								<UFormField name="type_id" :label="$t('components.productUpdate.productType')" required>
									<ZSelectMenuProductType v-model:type-id="formState.type_id" />
								</UFormField>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField name="code" :label="$t('components.productUpdate.productCode')">
										<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.uniqueIdentifier') }}</p>
										<UInput v-model="formState.code" :placeholder="$t('components.productUpdate.productCodePlaceholder')" disabled />
									</UFormField>
									<UFormField name="name" :label="$t('components.productUpdate.productName')" required>
										<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.nameCustomersSee') }}</p>
										<UInput v-model="formState.name" :placeholder="$t('components.productUpdate.productNamePlaceholder')" />
									</UFormField>
								</div>

								<UFormField name="short_desc" :label="$t('components.productUpdate.shortDescription')" required>
									<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.briefDescription') }}</p>
									<UInput v-model="formState.short_desc" :placeholder="$t('components.productUpdate.shortDescPlaceholder')" />
								</UFormField>
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
											:existing-images="formState.thumbnail ? [formState.thumbnail] : []"
											@files-selected="updateThumbnail"
											@delete-image="deleteThumbnail"
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
					<ZInputProductClassificationSection v-model:categories="categories" v-model:tags="tags" v-model:brands="brands" />

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

					<!-- Section 4: Additional Info (only show for physical items) -->
					<UCard id="section-additional-info" class="shadow-md scroll-mt-4">
						<template #header>
							<ZInputProductAdditionalInfoSectionHeader />
						</template>
						<ZInputProductAdditionalInfo
							:product="productForAdditionalInfo"
							@update:variations="updateProductVariations"
							@update:variants="updateProductVariants"
							@update:metadata="updateProductMetadata"
						/>
					</UCard>
				</UForm>
			</div>

			<!-- Right: Review Summary (Sticky on laptop) -->
			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<FormProductReviewSummary :summary="reviewSummary" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ProductStatus } from 'wemotoo-common';
import type { Category } from '~/utils/types/category';
import type { Product, ProductVariantInput } from '~/utils/types/product';
import type { Tag } from '~/utils/types/tag';
import type { Brand } from '~/utils/types/brand';
import type { ProductCreate, ProductUpdate } from '~/utils/types/form/product-creation';
import { createUpdateProductValidation } from '~/utils/schema';
import { ZModalConfirmation, ZModalLoading } from '#components';
import type { Image } from '~/utils/types/image';
import type { FormErrorEvent } from '#ui/types';
import type { ProductVariationInput } from '~/utils/types/product-variation';

const { t } = useI18n();
const updateProductSchema = computed(() => createUpdateProductValidation(t));
const formRef = ref();

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
		variations:
			product.variations
				?.filter((variation) => variation != null)
				.map((variation) => ({
					id: variation.id,
					name: variation.name,
					options:
						variation.options
							?.filter((option) => option != null)
							.map((option) => ({
								id: option.id,
								variation_id: option.variation_id,
								value: option.value,
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
								option_id: option.variation_id,
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
// Pass shape compatible with ProductCreate | Product (category_codes present; type for child)
const productForAdditionalInfo = computed(() => {
	const state = formState.value;
	return {
		...state,
		type: state.type_id,
		category_codes: state.category_codes,
		type_id: state.type_id ?? 0,
	} as ProductCreate | Product;
});

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
	...[{ id: 'section-additional-info', number: 4, name: t('pages.additionalInfo'), description: t('pages.additionalInfoDesc'), required: false }],
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
		return formState.value.price_types?.[0]?.orig_sell_price;
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

// Computed: Review summary for shared ReviewSummary component
const reviewSummary = computed(() => ({
	name: formState.value.name ?? '',
	code: formState.value.code,
	isActive: formState.value.is_active ?? true,
	currencyCode: currency_code.value,
	origSellPrice: orig_sell_price.value,
	salePrice: sale_price.value,
	costPrice: cost_price.value,
	categoriesCount: categories.value?.length ?? 0,
	tagsCount: tags.value?.length ?? 0,
	brandsCount: brands.value?.length ?? 0,
	variantsCount: formState.value.variants?.length ?? 0,
	optionsCount: formState.value.variations?.length ?? 0,
	hasThumbnail: !!formState.value.thumbnail,
	imagesCount: formState.value.images?.length ?? 0,
	thumbnail: formState.value.thumbnail,
	images: formState.value.images ?? [],
}));

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

// Methods: Product Variations & Variants
const updateProductVariations = (value: ProductVariationInput[]) => {
	formState.value.variations = value;
};

const updateProductVariants = (value: ProductVariantInput[]) => {
	formState.value.variants = value;
};

const updateProductMetadata = (value: any) => {
	formState.value.metadata = value;
};

// Field-to-section mapping for scroll-to-error
const fieldSectionMap: Record<string, string> = {
	code: 'section-basic-info',
	name: 'section-basic-info',
	short_desc: 'section-basic-info',
	long_desc: 'section-basic-info',
	status: 'section-basic-info',
	is_active: 'section-basic-info',
	type_id: 'section-basic-info',
	categories: 'section-classification',
	tags: 'section-classification',
	price_types: 'section-pricing',
};

const onError = (event: FormErrorEvent) => {
	const firstError = event.errors[0];
	const errorName = firstError?.name;
	if (!errorName) return;

	const fieldName = errorName.split('.')[0] ?? errorName;
	const sectionId = fieldSectionMap[fieldName];

	if (sectionId) {
		const sectionEl = document.getElementById(sectionId);
		if (sectionEl) {
			sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
			activeSection.value = sectionId;
		}
	}

	nextTick(() => {
		const errorEl = document.getElementById(errorName);
		errorEl?.focus();
	});
};

// Methods: Form Submission
const hasZeroOrigSellPrice = () => {
	const productPrices = formState.value.price_types ?? [];
	if (productPrices.some((p) => Number(p.orig_sell_price) === 0)) return true;
	const variants = formState.value.variants ?? [];
	return variants.some((v) => v.price_types?.some((p) => Number(p.orig_sell_price) === 0));
};

const doUpdateProduct = async () => {
	const overlay = useOverlay();
	const loadingModal = overlay.create(ZModalLoading, {
		props: { key: 'loading' },
	});

	loadingModal.open();

	try {
		const productStore = useProductStore();
		const success = await productStore.updateProduct({
			code: formState.value.code!,
			...formState.value,
		});
		if (success) {
			productStore.getProduct(formState.value.code!);
		}
	} catch (error) {
		console.error(error);
	} finally {
		loadingModal.close();
	}
};

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

	if (hasZeroOrigSellPrice()) {
		const overlay = useOverlay();
		const confirmModal = overlay.create(ZModalConfirmation, {
			props: {
				title: t('modal.confirmOrigSellPriceZeroTitle'),
				message: t('modal.confirmOrigSellPriceZeroMessage'),
				titleVariant: 'danger',
				action: 'confirm',
				onConfirm: async () => {
					await doUpdateProduct();
					confirmModal.close();
				},
				onCancel: () => {
					confirmModal.close();
				},
			},
		});
		confirmModal.open();
		return;
	}

	await doUpdateProduct();
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

// Expose submit method that triggers UForm validation
const submit = () => {
	formRef.value?.submit();
};
defineExpose({ submit });

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
