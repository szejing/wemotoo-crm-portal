<template>
	<UForm :schema="CreateProductValidation" :state="newProduct" class="space-y-4" @submit="onSubmit">
		<!-- *********************** General Info *********************** -->
		<ZInputProductGeneralInfo
			v-model:is-active="newProduct.is_active"
			v-model:is-giftcard="newProduct.is_giftcard"
			v-model:is-discountable="newProduct.is_discountable"
			v-model:code="newProduct.code"
			v-model:name="newProduct.name"
			v-model:short_desc="newProduct.short_desc"
			v-model:long_desc="newProduct.long_desc"
			v-model:type="newProduct.type"
		/>
		<!-- *********************** General Info *********************** -->

		<!-- *********************** Pricing *********************** -->
		<ZInputPricing
			v-model:orig-sell-price.number="orig_sell_price"
			v-model:cost-price.number="cost_price"
			v-model:sale-price.number="sale_price"
			v-model:currency-code="currency_code"
		/>
		<!-- *********************** Pricing *********************** -->

		<!-- *********************** Additional Info *********************** -->
		<ZInputProductAdditionalInfo
			:product="newProduct"
			@update_options="updateProductOptions"
			@update_variants="updateProductVariants"
			@update_metadata="updateProductMetadata"
		/>
		<!-- *********************** Additional Info *********************** -->

		<div class="flex-center text-center">
			<UButton class="w-[100%] sm:w-[50%]" size="md" color="green" variant="solid" type="submit" block :loading="adding">Submit</UButton>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { ProductStatus } from 'wemotoo-common';
import { CreateProductValidation } from '~/utils/schema';
import type { CategoryInput } from '~/utils/types/category';

import type { PriceInput } from '~/utils/types/price';
import type { ProdOptionInput, ProdVariantInput } from '~/utils/types/product';
import type { TagInput } from '~/utils/types/tag';

type Schema = z.output<typeof CreateProductValidation>;

const productStore = useProductStore();
const { newProduct, adding } = storeToRefs(productStore);

onMounted(() => {
	productStore.resetNewProduct();
});

const updateProductOptions = (value: any) => {
	newProduct.value.options = value;
};

const updateProductVariants = (value: any) => {
	newProduct.value.variants = value;
};

const updateProductMetadata = (value: any) => {
	newProduct.value.metadata = value;
};

const currency_code = computed({
	get() {
		return newProduct.value.price_types?.[0]?.currency_code ?? undefined;
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

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, name, short_desc, long_desc, is_active, price_types, categories, tags, status, galleries, thumbnail, options, variants, type } = event.data;

	// price_types
	const prodPrice: PriceInput[] = [];
	price_types?.forEach((price) => {
		prodPrice.push({
			id: undefined,
			orig_sell_price: price.orig_sell_price,
			cost_price: price.cost_price,
			sale_price: price.sale_price,
			currency_code: price.currency_code,
		});
	});

	// product categories
	const prodCategories: CategoryInput[] = [];
	categories?.forEach((category) => {
		prodCategories.push({
			code: category.code!,
		});
	});

	// product tags
	const prodTags: TagInput[] = [];
	tags?.forEach((tag) => {
		prodTags.push({
			id: tag.id!,
		});
	});

	// product options
	const prodOptions: ProdOptionInput[] = [];
	options?.forEach((option) => {
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

	// product variants
	const prodVariants: ProdVariantInput[] = [];
	variants?.forEach((variant) => {
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

	const result = await productStore.addProduct({
		code,
		name,
		short_desc,
		long_desc,
		is_active,
		is_discountable: true,
		is_giftcard: false,
		price_types: prodPrice,
		categories: prodCategories,
		type: type,
		tags: prodTags,
		status: status == ProductStatus.PUBLISHED ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
		galleries,
		thumbnail,
		options: prodOptions,
		variants: prodVariants,
		metadata: JSON.parse(JSON.stringify(newProduct.value.metadata)),
	});

	if (result) {
		navigateTo('/products');
	}
};
</script>

<style scoped lang="postcss"></style>
