<template>
	<div class="space-y-4">
		<!-- Header Section -->
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">2</div>
					<h3 class="text-base font-semibold text-neutral-900">{{ $t('components.zInput.generateProductVariants') }}</h3>
				</div>
				<p class="text-xs text-neutral-500 mt-1 ml-10">{{ $t('components.zInput.combineOptionsDesc') }}</p>
			</div>
		</div>

		<!-- No Variations State -->
		<div v-if="!prodVariations || prodVariations.length === 0" class="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center bg-neutral-50">
			<div class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
				<UIcon :name="ICONS.ALERT" class="w-6 h-6 text-neutral-400" />
			</div>
			<p class="text-sm font-medium text-neutral-900 mb-1">{{ $t('components.zInput.defineVariationsFirst') }}</p>
			<p class="text-xs text-neutral-500">{{ $t('components.zInput.addVariationsAbove') }}</p>
		</div>

		<!-- Has Variations -->
		<div v-else class="space-y-4">
			<!-- Combination Preview Card -->
			<div class="border border-primary-200 rounded-lg p-4 bg-linear-to-br from-primary-50 to-purple-50">
				<div class="flex items-start gap-3">
					<div class="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
						<UIcon :name="ICONS.CUBE" class="w-5 h-5 text-primary-600" />
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center justify-between mb-2">
							<div>
								<h4 class="text-sm font-semibold text-neutral-900">{{ $t('components.zInput.possibleCombinations') }}</h4>
								<p class="text-xs text-neutral-600 mt-0.5">
									{{
										$t('components.zInput.basedOnSelectedOptions', {
											count: selectedVariations.length,
											optionLabel: selectedVariations.length === 1 ? $t('components.zInput.option') : $t('components.zInput.options'),
										})
									}}
								</p>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-primary-600">{{ totalPossibleVariants }}</div>
								<p class="text-xs text-neutral-500">{{ $t('components.zInput.variantsLabel') }}</p>
							</div>
						</div>

						<!-- Variation Preview -->
						<div v-if="selectedVariations.length > 0" class="flex flex-wrap gap-2 mb-3">
							<div
								v-for="(variation, idx) in selectedVariations"
								:key="idx"
								class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md border border-primary-200"
							>
								<UIcon :name="ICONS.CHECK_ROUNDED" class="w-3 h-3 text-green-600" />
								<span class="text-xs font-medium text-neutral-900">{{ variation.options.map((option) => option.value).join('_') }}</span>
								<span class="text-xs text-neutral-500">({{ variation.options?.length || 0 }})</span>
							</div>
						</div>
						<div v-else class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
							<div class="flex items-center gap-2 text-xs text-amber-700">
								<UIcon :name="ICONS.ALERT" class="w-4 h-4" />
								<span>{{ $t('components.zInput.noVariationsSelected') }}</span>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex flex-wrap gap-2">
							<UButton
								v-if="prodVariants.length === 0"
								color="primary"
								size="sm"
								:icon="ICONS.SPARKLES"
								:disabled="selectedVariations.length === 0 || totalPossibleVariants === 0"
								@click="autoGenerate"
							>
								Auto Generate All Variants
							</UButton>
							<UButton v-else color="success" variant="soft" size="sm" :icon="ICONS.REFRESH" :disabled="selectedVariations.length === 0" @click="autoGenerate">
								Regenerate All Variants
							</UButton>
						</div>
					</div>
				</div>
			</div>

			<!-- Variants List -->
			<div v-if="prodVariants.length > 0" class="space-y-3">
				<!-- Variants Header -->
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<h4 class="text-sm font-semibold text-neutral-900">Your Variants</h4>
						<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
							{{ prodVariants.length }} / {{ totalPossibleVariants }}
						</span>
					</div>
					<p class="text-xs text-neutral-500">Click a variant to edit details</p>
				</div>

				<!-- Variants Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div
						v-for="(variant, index) in prodVariants"
						:key="index"
						class="border border-neutral-200 rounded-lg p-3 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer group"
						@click="viewVariant(variant)"
					>
						<div class="flex items-start gap-3">
							<!-- Variant Number Badge -->
							<div class="w-8 h-8 rounded-lg bg-linear-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shrink-0">
								<span class="text-xs font-bold text-neutral-600">#{{ index + 1 }}</span>
							</div>

							<!-- Variant Info -->
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between mb-1.5">
									<div class="flex flex-wrap gap-1">
										<span
											v-for="(option, optionIdx) in variant.options"
											:key="optionIdx"
											class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-700"
										>
											{{ option.value }}
										</span>
									</div>
									<UIcon :name="ICONS.CHEVRON_RIGHT" class="w-4 h-4 text-neutral-400 group-hover:text-primary-500 shrink-0" />
								</div>

								<!-- Variant Meta Info -->
								<div class="flex items-center gap-3 text-xs text-neutral-500">
									<span v-if="variant.variant_code" class="flex items-center gap-1">
										<UIcon :name="ICONS.BARCODE" class="w-3 h-3" />
										{{ variant.variant_code }}
									</span>
								</div>

								<!-- Variant Price -->
								<div class="flex items-center gap-1 mt-1">
									<UIcon :name="ICONS.CURRENCY" class="text-main" />

									<p v-if="variant.price_types?.[0]?.sale_price" class="text-sm font-medium text-main">
										{{ formatCurrency(variant.price_types?.[0].sale_price ?? 0) }}
									</p>
									<p v-else class="text-sm font-medium text-main">
										{{ formatCurrency(variant.price_types?.[0]?.orig_sell_price ?? 0) }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Empty Variants State (when options exist but no variants) -->
			<div v-else class="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center">
				<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
					<UIcon :name="ICONS.SPARKLES" class="w-6 h-6 text-purple-600" />
				</div>
				<p class="text-sm font-medium text-neutral-900 mb-1">{{ $t('components.zInput.readyToCreateVariants', { count: totalPossibleVariants }) }}</p>
				<p class="text-xs text-neutral-500 mb-4">{{ $t('components.zInput.autoGenerateHint') }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZInputProductVariantDetail } from '#components';
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { Product, ProductVariantInput } from '~/utils/types/product';
import { formatCurrency } from 'wemotoo-common';
import type { ProductOptionInput } from '~/utils/types/product-option';
import type { ProductVariationInput } from '~/utils/types/product-variation';

const overlay = useOverlay();
const props = defineProps<{
	product: Product | ProductCreate;
	variations: ProductVariationInput[] | undefined;
	variants: ProductVariantInput[] | undefined;
}>();
const emit = defineEmits(['update:variants', 'delete:variant']);

const prodVariations = computed({
	get() {
		return props.variations ?? [];
	},
	set(_) {},
});

const prodVariants = computed({
	get() {
		return props.variants ?? [];
	},
	set(value) {
		emit('update:variants', value);
	},
});

// Get only selected options
const selectedVariations = computed(() => {
	return prodVariations.value.filter((variation) => variation.selected !== false);
});

const totalPossibleVariants = computed(() => {
	if (selectedVariations.value.length === 0) return 0;
	return selectedVariations.value.reduce((acc, variation) => acc * (variation?.options?.length || 0), 1);
});

const autoGenerate = () => {
	if (selectedVariations.value.length === 0) return;
	const variants: ProductVariantInput[] = [];

	const combine = (currentOptions: ProductOptionInput[], optionIndex: number) => {
		if (optionIndex === selectedVariations.value.length) {
			variants.push({ options: [...currentOptions] });
			return;
		}

		const variation = selectedVariations.value[optionIndex];
		if (!variation || !variation.options) return;

		combine(
			[...currentOptions, { id: variation.id, variation_id: variation.id, value: variation.options.map((option) => option.value).join('_') }],
			optionIndex + 1,
		);
	};

	combine([], 0);

	variants.forEach((variant) => {
		if (variant.name) return;

		variant.name = variant.options?.map((option) => option.value).join('_');
		variant.variant_code = props.product.code + '_' + variant.name;
		variant.product_code = props.product.code;

		if (variant.price_types) return;

		if (props.product.price_types) {
			variant.price_types = [JSON.parse(JSON.stringify(props.product.price_types[0]))];
		} else {
			variant.price_types = undefined;
		}

		for (const price of variant.price_types ?? []) {
			if (price.id == props.product.price_types?.[0]?.id) {
				price.id = undefined;
			}
		}
	});

	prodVariants.value = variants;
};

const viewVariant = (variant: ProductVariantInput) => {
	const modal = overlay.create(ZInputProductVariantDetail, {
		props: {
			product: props.product,
			details: JSON.parse(JSON.stringify(variant)),
			onUpdate: (variant: ProductVariantInput) => {
				const index = prodVariants.value.findIndex(
					(v: ProductVariantInput) => v.variant_code === variant.variant_code && v.product_code === variant.product_code,
				); // Find variant by codes

				if (index !== -1) {
					prodVariants.value[index] = { ...variant }; // Replace all details of the found variant
				}
				emit('update:variants', prodVariants.value);
				modal.close();
			},
			onDelete: (variant: ProductVariantInput) => {
				console.log('delete variant', variant);
			},
			onCancel: () => {
				modal.close();
			},
		},
	});
	modal.open();
};
</script>

<style scoped></style>
