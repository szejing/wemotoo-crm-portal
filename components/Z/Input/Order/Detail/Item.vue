<template>
	<div class="section-grid-basic-details">
		<div class="flex-jbetween-icenter w-full mt-4">
			<div class="flex-icenter gap-4">
				<div>
					<h2 class="font-light">#{{ prodCode }}</h2>
					<p>{{ prodName }}</p>
				</div>
				<div>
					<UBadge v-if="status == OrderItemStatus.ACTIVE" size="md" color="green">
						ACTIVE
						<template #trailing>
							<UIcon color="white" class="w-4 h-4 cursor-pointer" :name="ICONS.CHEVRON_RIGHT" @click="updateStatus(OrderItemStatus.VOIDED)" />
						</template>
					</UBadge>
					<UBadge v-else-if="status == OrderItemStatus.VOIDED" size="md" color="main">
						VOIDED
						<template #trailing>
							<UIcon color="white" class="w-4 h-4 cursor-pointer" :name="ICONS.CHEVRON_RIGHT" @click="updateStatus(OrderItemStatus.REFUNDED)" />
						</template>
					</UBadge>
					<UBadge v-else-if="status == OrderItemStatus.REFUNDED" size="md" color="red">
						REFUNDED
						<template #trailing>
							<UIcon color="white" class="w-4 h-4 cursor-pointer" :name="ICONS.CHEVRON_RIGHT" @click="updateStatus(OrderItemStatus.ACTIVE)" />
						</template>
					</UBadge>
				</div>
			</div>

			<ZQuantity v-model:quantity="orderQty" />
		</div>

		<div>
			<h2 class="text-main">Pricing</h2>

			<div class="grid grid-cols-2 gap-4 mt-2">
				<UFormGroup label="Currency" name="currency">
					<ZSelectMenuCurrency v-model:currency-code="currencyCode" />
				</UFormGroup>

				<UFormGroup v-slot="{ error }" label="Unit Sell Price" name="unit_sell_price" required>
					<UInput v-model="unitSellPrice" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Unit Sell Price" class="mt-2" />
				</UFormGroup>
			</div>
		</div>

		<div v-if="prodVariants.length > 0">
			<h2 class="text-main">Variants</h2>

			<ul>
				<div v-for="variant in prodVariants" :key="variant!.variant_code">
					<UButton
						:color="selectedVariantCode == variant!.variant_code ? 'main' : 'gray'"
						:variant="selectedVariantCode == variant!.variant_code ? 'solid' : 'outline'"
						size="sm"
						@click="updateVariant(variant)"
					>
						{{ variant!.variant_code }}
					</UButton>
				</div>
			</ul>
		</div>

		<div class="mt-4 text-end">
			<h3 class="text-main">Total Price : {{ currencyCode }} {{ total }}</h3>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { OrderItemStatus } from 'wemotoo-common';
import type { ProductVariant } from '~/utils/types/product-variant';

const { $api } = useNuxtApp();
const isLoading = ref(false);
const prodVariants = ref<ProductVariant[]>([]);
const selectedVariantCode = ref<ProductVariant>();

const props = defineProps<{
	status: OrderItemStatus;
	prodCode: string;
	prodName: string;
	prodVariantCode?: string;
	prodVariantName?: string;
	prodVariantSku?: string;
	currencyCode: string;
	orderQty: number;
	unitSellPrice: number;
}>();

onMounted(async () => {
	selectedVariantCode.value = props.prodVariantCode;

	if (props.prodVariantCode) {
		isLoading.value = true;

		try {
			const { variants } = await $api.productVariant.getVariantsByProdCode(props.prodCode);

			prodVariants.value = variants;
		} catch (error) {
			console.error(error);
		} finally {
			isLoading.value = false;
		}
	}
});

const emit = defineEmits([
	'update:status',
	'update:prodCode',
	'update:prodName',
	'update:prodVariantCode',
	'update:prodVariantName',
	'update:prodVariantSku',
	'update:currencyCode',
	'update:orderQty',
	'update:unitSellPrice',
]);

const status = computed({
	get() {
		return props.status;
	},
	set(value) {
		emit('update:status', value);
	},
});

const prodCode = computed({
	get() {
		return props.prodCode;
	},
	set(value) {
		emit('update:prodCode', value);
	},
});

const prodName = computed({
	get() {
		return props.prodName;
	},
	set(value) {
		emit('update:prodName', value);
	},
});

// const prodVariantId = computed({
// 	get() {
// 		return props.prodVariantId;
// 	},
// 	set(value) {
// 		emit('update:prodVariantId', value);
// 	},
// });

// const prodVariantName = computed({
// 	get() {
// 		return props.prodVariantName;
// 	},
// 	set(value) {
// 		emit('update:prodVariantName', value);
// 	},
// });

// const prodVariantSku = computed({
// 	get() {
// 		return props.prodVariantSku;
// 	},
// 	set(value) {
// 		emit('update:prodVariantSku', value);
// 	},
// });

const currencyCode = computed({
	get() {
		return props.currencyCode;
	},
	set(value) {
		emit('update:currencyCode', value);
	},
});

const orderQty = computed({
	get() {
		return props.orderQty;
	},
	set(value) {
		console.log(value);
		emit('update:orderQty', value);
	},
});

const unitSellPrice = computed({
	get() {
		return props.unitSellPrice;
	},
	set(value) {
		emit('update:unitSellPrice', value);
	},
});

const updateStatus = (newStatus: OrderItemStatus) => {
	status.value = newStatus;
};

const updateVariant = (variant: ProductVariant) => {
	selectedVariantCode.value = variant.variant_code;

	emit('update:prodVariantCode', variant.variant_code);
	emit('update:prodVariantName', variant.name);
	emit('update:prodVariantSku', variant.sku);

	unitSellPrice.value = variant!.price_types![0].sale_price ?? 0;
};

const total = computed(() => {
	return unitSellPrice.value * orderQty.value;
});
</script>

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid gap-4;
}

ul {
	@apply flex flex-wrap gap-4 mt-2;
}
</style>
