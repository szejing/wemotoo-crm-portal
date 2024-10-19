<template>
	<div>
		<UForm :schema="CreateProductValidation" :state="newProduct" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputProductGeneralInfo
				v-model:is-active="newProduct.is_active"
				v-model:is-service="newProduct.is_service"
				v-model:is-giftcard="newProduct.is_giftcard"
				v-model:is-discountable="newProduct.is_discountable"
				v-model:code="newProduct.code"
				v-model:title="newProduct.title"
				v-model:subtitle="newProduct.subtitle"
				v-model:description="newProduct.description"
			/>
			<!-- *********************** General Info *********************** -->

			<!-- *********************** Pricing *********************** -->
			<ZInputProductPricing v-model:selling-price.number="origSellPrice" v-model:cost-price.number="costPrice" v-model:sale-price.number="salePrice" />
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

const productStore = useProductStore();
const { newProduct } = storeToRefs(productStore);

const origSellPrice = computed({
	get() {
		return newProduct.value.prices?.[0]?.origSellPrice ?? undefined;
	},
	set(value) {
		if (newProduct.value.prices && newProduct.value.prices.length > 0) {
			newProduct.value.prices[0].origSellPrice = value;
		}
	},
});

const costPrice = computed({
	get() {
		return newProduct.value.prices?.[0]?.costPrice ?? undefined;
	},
	set(value) {
		if (newProduct.value.prices && newProduct.value.prices.length > 0) {
			newProduct.value.prices[0].costPrice = value;
		}
	},
});

const salePrice = computed({
	get() {
		return newProduct.value.prices?.[0]?.salePrice ?? undefined;
	},
	set(value) {
		if (newProduct.value.prices && newProduct.value.prices.length > 0) {
			newProduct.value.prices[0].salePrice = value;
		}
	},
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event);
};
</script>

<style scoped lang="css"></style>
