<template>
	<UCard>
		<template #header>
			<h1>{{ product.name }} - [{{ variantDetail?.name?.replace('_', ' · ') }}]</h1>
		</template>

		<div class="space-y-4 divide-y divide-gray-300">
			<!-- *********************** Pricing *********************** -->
			<div v-if="variantDetail.prices && variantDetail.prices.length > 0">
				<div v-for="(price, index) in variantDetail.prices" :key="index">
					<ZInputProductPricing
						v-model:selling-price.number="price.origSellPrice"
						v-model:cost-price.number="price.costPrice"
						v-model:sale-price.number="price.salePrice"
						v-model:currency="price.currency"
						:card-ui="cardUi"
					/>
				</div>
			</div>
			<!-- *********************** Pricing *********************** -->

			<!-- *********************** Info *********************** -->
			<ZInputProductVariantInfo v-model:details="variantDetail" :card-ui="cardUi" />
			<!-- *********************** Info *********************** -->

			<!-- *********************** Inventory *********************** -->
			<ZInputProductInventory v-model:details="variantDetail" :card-ui="cardUi" />
			<!-- *********************** Inventory *********************** -->
		</div>

		<template #footer>
			<UButton size="md" color="primary" variant="outline" block @click="updateProductVariant">Confirm</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import type { Product, ProdVariantInput } from '~/utils/types/product';

const cardUi = {
	shadow: 'shadow-none',
	ring: 'ring-none',
	header: {
		padding: 'px-0 py-2',
	},
	body: {
		padding: 'px-0 py-3',
	},
	footer: {
		padding: 'px-0 pt-2 pb-2',
	},
};

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

<style></style>
