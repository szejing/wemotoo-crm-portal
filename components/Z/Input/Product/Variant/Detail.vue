<template>
	<UCard>
		<template #header>
			<h1>{{ product.name }} - [{{ variantDetail?.name?.replace('_', ' · ') }}]</h1>
		</template>

		<div class="space-y-4 divide-y divide-gray-300">
			<!-- *********************** Pricing *********************** -->
			<div v-if="variantDetail.price_types && variantDetail.price_types.length > 0">
				<div v-for="price_type in variantDetail.price_types" :key="price_type.id">
					<ZInputPricing
						v-model:orig-sell-price.number="price_type.orig_sell_price"
						v-model:cost-price.number="price_type.cost_price"
						v-model:sale-price.number="price_type.sale_price"
						v-model:currency-code="price_type.currency_code"
						:card-ui="borderless_card_ui"
					/>
				</div>
			</div>
			<div v-else>
				<ZInputPricing
					v-model:orig-sell-price.number="price.orig_sell_price"
					v-model:cost-price.number="price.cost_price"
					v-model:sale-price.number="price.sale_price"
					v-model:currency-code="price.currency_code"
					:card-ui="borderless_card_ui"
				/>
			</div>
			<!-- *********************** Pricing *********************** -->

			<!-- *********************** Info *********************** -->
			<!-- <ZInputProductVariantInfo v-model:details="variantDetail" :card-ui="borderless_card_ui" /> -->
			<!-- *********************** Info *********************** -->

			<!-- *********************** Inventory *********************** -->
			<!-- <ZInputProductInventory v-model:details="variantDetail" :card-ui="borderless_card_ui" /> -->
			<!-- *********************** Inventory *********************** -->
		</div>

		<template #footer>
			<div class="flex-jbetween-icenter">
				<UButton color="error" variant="ghost" @click="onDelete">Delete</UButton>

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="soft" @click="onCancel">Cancel</UButton>
					<UButton color="primary" variant="solid" @click="updateProductVariant">Confirm</UButton>
				</div>
			</div>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import type { PriceInput } from '~/utils/types/price';
import type { Product, ProductVariantInput } from '~/utils/types/product';

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
	details: {
		type: Object as PropType<ProductVariantInput>,
		required: true,
	},
});

const price = ref<PriceInput>({
	orig_sell_price: props.product.price_types?.[0]?.orig_sell_price ?? 0,
	cost_price: props.product.price_types?.[0]?.cost_price ?? 0,
	sale_price: props.product.price_types?.[0]?.sale_price ?? 0,
	currency_code: props.product.price_types?.[0]?.currency_code ?? 'MYR',
	id: undefined,
});

const emit = defineEmits(['update:variantDetail', 'cancel:variantDetail', 'delete:variantDetail']);

const variantDetail = computed({
	get() {
		return JSON.parse(JSON.stringify(props.details));
	},
	set(_) {},
});

const updateProductVariant = () => {
	if (variantDetail.value.price_types?.length == 0) {
		variantDetail.value.price_types = [price.value];
	}

	emit('update:variantDetail', variantDetail.value);
};

const onDelete = () => {
	emit('delete:variantDetail', variantDetail.value);
};

const onCancel = () => {
	emit('cancel:variantDetail');
};
</script>

<style scoped></style>
