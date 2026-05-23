import type { ProductOptionInput } from '~/utils/types/product-option';
import type { ProductVariationInput } from '~/utils/types/product-variation';

/** Variations with at least one non-empty option value (name is optional). */
export function getValidProductVariations(variations: ProductVariationInput[] | undefined): ProductVariationInput[] {
	return (variations ?? []).filter((variation) => variation.options.some((option) => option.value.trim() !== ''));
}

export function getValidProductOptions(variation: ProductVariationInput): ProductOptionInput[] {
	return variation.options.filter((option) => option.value.trim() !== '');
}

export function resolveProductVariationId(variation: ProductVariationInput, option?: ProductOptionInput): number | undefined {
	return variation.id ?? option?.variation_id ?? variation.options.find((o) => o.variation_id != null)?.variation_id;
}
