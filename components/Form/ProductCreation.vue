<template>
	<div>
		<UForm :schema="CreateProductValidation" :state="newProduct" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputProductGeneralInfo
				v-model:is-active="newProduct.is_active"
				v-model:is-service="newProduct.is_service"
				v-model:is-giftcard="newProduct.is_giftcard"
				v-model:is-discountable="newProduct.is_discountable"
				v-model:product-code="newProduct.code"
				v-model:product-title="newProduct.title"
				v-model:product-subtitle="newProduct.subtitle"
				v-model:product-description="newProduct.description"
			/>
			<!-- *********************** General Info *********************** -->

			<!-- *********************** Pricing *********************** -->
			<ZInputProductPricing
				v-model:product-selling-price="newProduct.origSellPrice"
				v-model:product-cost-price="newProduct.costPrice"
				v-model:product-sale-price="newProduct.salePrice"
			/>
			<!-- *********************** Pricing *********************** -->

			<!-- *********************** Additional Info *********************** -->
			<ZInputProductAdditionalInfo />
			<!-- *********************** Additional Info *********************** -->

			<div class="flex-center text-center">
				<UButton class="w-[100%] sm:w-[50%]" size="md" color="green" variant="solid" type="submit" block>Submit</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { useProductStore } from '~/stores/Products/Products';
import { CreateProductValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductValidation>;

// const state = reactive({
// 	code: undefined,
// 	title: undefined,
// 	subtitle: undefined,
// 	description: undefined,
// 	is_discountable: true,
// 	is_giftcard: false,
// 	is_active: true,
// 	is_service: false,
// 	// price details
// 	currency: undefined,
// 	origSellPrice: undefined,
// 	costPrice: undefined,
// 	salePrice: undefined,
// });

const productStore = useProductStore();
const { newProduct } = storeToRefs(productStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event);
};
</script>

<style scoped lang="css"></style>
