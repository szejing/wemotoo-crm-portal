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
				v-model:name="newProduct.name"
				v-model:subtitle="newProduct.subtitle"
				v-model:description="newProduct.description"
			/>
			<!-- *********************** General Info *********************** -->

			<!-- *********************** Pricing *********************** -->
			<ZInputProductPricing
				v-model:selling-price.number="origSellPrice"
				v-model:cost-price.number="costPrice"
				v-model:sale-price.number="salePrice"
				v-model:currency="currency"
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

const productStore = useProductStore();
const { newProduct } = storeToRefs(productStore);

onMounted(() => {
	productStore.resetNewProduct();
});

const currency = computed({
	get() {
		return newProduct.value.prices?.[0]?.currency ?? undefined;
	},
	set(value) {
		if (newProduct.value.prices && newProduct.value.prices.length > 0) {
			newProduct.value.prices[0].currency = value;
		} else {
			newProduct.value.prices = [{ origSellPrice: origSellPrice.value, costPrice: costPrice.value, salePrice: salePrice.value, currency: value }];
		}
	},
});

const origSellPrice = computed({
	get() {
		return newProduct.value.prices?.[0]?.origSellPrice ?? undefined;
	},
	set(value) {
		if (newProduct.value.prices && newProduct.value.prices.length > 0) {
			newProduct.value.prices[0].origSellPrice = value;
		} else {
			newProduct.value.prices = [{ origSellPrice: value, costPrice: costPrice.value, salePrice: salePrice.value, currency: currency.value }];
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
		} else {
			newProduct.value.prices = [{ costPrice: value, origSellPrice: origSellPrice.value, salePrice: salePrice.value, currency: currency.value }];
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
		} else {
			newProduct.value.prices = [{ salePrice: value, origSellPrice: origSellPrice.value, costPrice: costPrice.value, currency: currency.value }];
		}
	},
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event.data);
};
</script>

<style scoped lang="css"></style>
