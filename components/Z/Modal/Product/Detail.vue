<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[80%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Product</h3></template>
			<UForm :schema="UpdateProductValidation" :state="current_product" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputProductGeneralInfo
					v-model:is-active="current_product.is_active"
					v-model:is-service="current_product.is_service"
					v-model:is-giftcard="current_product.is_giftcard"
					v-model:is-discountable="current_product.is_discountable"
					v-model:code="current_product.code"
					v-model:name="current_product.name"
					v-model:subtitle="current_product.subtitle"
					v-model:description="current_product.description"
					disabled-code
					:card-ui="borderless_card_ui"
				/>
				<!-- *********************** General Info *********************** -->

				<!-- *********************** Pricing *********************** -->
				<div v-for="(price, index) in current_product.price_types" :key="index">
					<ZInputProductPricing
						v-model:orig-sell-price.number="price.orig_sell_price"
						v-model:cost-price.number="price.cost_price"
						v-model:sale-price.number="price.sale_price"
						v-model:currency-code="price.currency_code"
						:card-ui="borderless_card_ui"
					/>
				</div>
				<!-- *********************** Pricing *********************** -->

				<!-- *********************** Additional Info *********************** -->
				<ZInputProductAdditionalInfo
					:product="current_product"
					:card-ui="borderless_card_ui"
					@update_options="updateProductOptions"
					@update_variants="updateProductVariants"
				/>
				<!-- *********************** Additional Info *********************** -->

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
					<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { UpdateProductValidation } from '~/utils/schema';
import type { Product } from '~/utils/types/product';

type Schema = z.output<typeof UpdateProductValidation>;

// const state = reactive({
// 	code: props.product.code,
// 	name: props.product.name,
// 	is_active: props.product.is_active,
// 	is_service: props.product.is_service,
// 	is_giftcard: props.product.is_giftcard,
// 	is_discountable: props.product.is_discountable,
// 	subtitle: props.product.subtitle,
// 	description: props.product.description,
// 	price_types: props.product.price_types,
// 	variants: props.product.variants,
// 	options: props.product.options,
// });

const props = defineProps({
	product: {
		type: Object as PropType<Product> | undefined,
		required: true,
	},
});

const productStore = useProductStore();
const { updating } = storeToRefs(productStore);

const emit = defineEmits(['update', 'cancel']);

const { product: current_product } = toRefs(props);

const updateProductOptions = (value: any) => {
	current_product.value.options = value;
};

const updateProductVariants = (value: any) => {
	current_product.value.variants = value;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	// const { name, values } = event.data;
	// if (name === '' || name === undefined) {
	// 	return;
	// }
	// emit('update', name, values ?? []);
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style></style>
