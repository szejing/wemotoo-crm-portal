<template>
	<UCard>
		<template #header>
			<h1>{{ product.name }} - [{{ variantDetail?.name?.replace('_', ' · ') }}]</h1>
		</template>

		<div class="space-y-4 divide-y divide-gray-300">
			<!-- *********************** Pricing *********************** -->
			<div v-if="variantDetail.price_types && variantDetail.price_types.length > 0">
				<div v-for="(price, index) in variantDetail.price_types" :key="index">
					<ZInputProductPricing
						v-model:orig-sell-price.number="price.orig_sell_price"
						v-model:cost-price.number="price.cost_price"
						v-model:sale-price.number="price.sale_price"
						v-model:currency-code="price.currency_code"
						:card-ui="borderless_card_ui"
					/>
				</div>
			</div>
			<!-- *********************** Pricing *********************** -->

			<!-- *********************** Info *********************** -->
			<ZInputProductVariantInfo v-model:details="variantDetail" :card-ui="borderkless_card_ui" />
			<!-- *********************** Info *********************** -->

			<!-- *********************** Inventory *********************** -->
			<ZInputProductInventory v-model:details="variantDetail" :card-ui="borderless_card_ui" />
			<!-- *********************** Inventory *********************** -->
		</div>

		<template #footer>
			<UButton size="md" color="primary" variant="outline" block @click="updateProductVariant">Confirm</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import type { Product, ProdVariantInput } from '~/utils/types/product';

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
	details: {
		type: Object as PropType<ProdVariantInput>,
		required: true,
	},
});

const emit = defineEmits(['update:variantDetail']);

const variantDetail = computed({
	get() {
		return JSON.parse(JSON.stringify(props.details));
	},
	set(_) {},
});

const updateProductVariant = () => {
	emit('update:variantDetail', variantDetail.value);
};
</script>

<style scoped lang="postcss"></style>
