<template>
	<div>
		<UForm :schema="CreateProductValidation" :state="state" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputProductGeneralInfo
				v-model:is-active="state.is_active"
				v-model:is-service="state.is_service"
				v-model:is-giftcard="state.is_giftcard"
				v-model:is-discountable="state.is_discountable"
				v-model:product-code="state.code"
				v-model:product-title="state.title"
				v-model:product-subtitle="state.subtitle"
				v-model:product-description="state.description"
			/>
			<!-- *********************** General Info *********************** -->

			<!-- *********************** Pricing *********************** -->
			<ZInputProductPricing
				v-model:product-selling-price="state.origSellPrice"
				v-model:product-cost-price="state.costPrice"
				v-model:product-sale-price="state.salePrice"
			/>
			<!-- *********************** Pricing *********************** -->

			<!-- *********************** Additional Info *********************** -->
			<ZInputProductAdditionalInfo :state="state" />
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
import { CreateProductValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductValidation>;

const state = reactive({
	code: undefined,
	title: undefined,
	subtitle: undefined,
	description: undefined,
	is_discountable: true,
	is_giftcard: false,
	is_active: true,
	is_service: false,
	// price details
	currency: undefined,
	origSellPrice: undefined,
	costPrice: undefined,
	salePrice: undefined,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event);
};
</script>

<style scoped lang="css"></style>
