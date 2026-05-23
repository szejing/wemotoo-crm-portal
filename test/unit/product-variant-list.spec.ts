import { describe, expect, it } from 'vitest';
import { getValidProductOptions, getValidProductVariations, resolveProductVariationId } from '../../app/utils/product-variant-list';
import type { ProductVariationInput } from '../../app/utils/types/product-variation';

describe('product-variant-list utils', () => {
	it('includes variations with empty names when options have values', () => {
		const variations: ProductVariationInput[] = [
			{
				name: '',
				options: [
					{ id: 25, variation_id: 9, value: 'husky' },
					{ id: 26, variation_id: 9, value: 'golden' },
				],
			},
			{
				name: '',
				options: [
					{ id: 28, variation_id: 10, value: 'long' },
					{ id: 29, variation_id: 10, value: 'short' },
				],
			},
		];

		expect(getValidProductVariations(variations)).toHaveLength(2);
	});

	it('excludes variations without option values', () => {
		const variations: ProductVariationInput[] = [
			{ name: 'Size', options: [{ value: '' }] },
			{ name: 'Color', options: [{ value: 'red' }] },
		];

		expect(getValidProductVariations(variations)).toHaveLength(1);
		expect(getValidProductVariations(variations)[0]?.name).toBe('Color');
	});

	it('resolves variation id from option when variation id is missing', () => {
		const variation: ProductVariationInput = {
			name: '',
			options: [{ id: 25, variation_id: 9, value: 'husky' }],
		};

		expect(resolveProductVariationId(variation, variation.options[0])).toBe(9);
	});

	it('filters blank option values', () => {
		const variation: ProductVariationInput = {
			name: 'Size',
			options: [{ value: 'long' }, { value: ' ' }, { value: 'short' }],
		};

		expect(getValidProductOptions(variation).map((option) => option.value)).toEqual(['long', 'short']);
	});
});
