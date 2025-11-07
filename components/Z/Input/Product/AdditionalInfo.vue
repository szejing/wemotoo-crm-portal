<template>
	<UCard :ui="cardUi">
		<template v-if="!hideHeader" #header>
			<h2>Additional Info</h2>
		</template>

		<!-- DESKTOP -->
		<div class="hidden sm:block" :class="[!hideHeader ? 'mt-4' : '']">
			<UTabs :items="product_additional_info" orientation="vertical" :ui="vertical_ui_tabs">
				<template #default="{ item, selected }">
					<h4 class="text-start truncate" :class="[selected && 'text-primary-500']">{{ item.label }}</h4>
				</template>

				<template #maintenance>
					<h1>Maintenance</h1>
					<p>Add maintenance information such as booking requirements, duration, working hours, etc.</p>
					<ZInputProductMaintenance v-model:metadata="product.metadata" @update:product-metadata="updateProductMetadata" />
				</template>

				<template #variants>
					<div class="flex flex-col h-full">
						<h1>Variants</h1>
						<p>Add variations of this product. Offer your customers different options for color, format, size, shape, etc.</p>

						<div class="space-y-8 mt-4">
							<ZInputProductOptions v-model:options="product.options" @update:product-options="updateProductOptions" />
							<ZInputProductVariantList
								:options="product.options"
								:variants="product.variants"
								:product="product"
								@delete:variant="deleteProductVariant"
								@update:variants="updateProductVariants"
							/>
						</div>
					</div>
				</template>

				<!-- <template #shipping>
					<h1>Shipping</h1>
				</template> -->

				<template #tax>
					<h1>Tax</h1>
				</template>
			</UTabs>
		</div>
		<!-- DESKTOP -->

		<!-- MOBILE -->
		<div class="sm:hidden" :class="[!hideHeader ? 'mt-4' : '']">
			<UTabs :items="product_additional_info" :ui="normal_ui_tabs">
				<template #default="{ item, selected }">
					<h4 class="text-start truncate" :class="[selected && 'text-primary-500']">{{ item.label }}</h4>
				</template>

				<template #maintenance>
					<div class="flex flex-col h-full">
						<h1>Maintenance</h1>
						<p>Add maintenance information such as booking requirements, duration, working hours, etc.</p>
						<ZInputProductMaintenance v-model:metadata="product.metadata" @update:product-metadata="updateProductMetadata" />
					</div>
				</template>

				<template #variants>
					<div class="flex flex-col h-full">
						<h1>Variants</h1>
						<p>Add variations of this product. Offer your customers different options for color, format, size, shape, etc.</p>

						<div class="space-y-8 mt-4">
							<ZInputProductOptions v-model:options="product.options" @update:product-options="updateProductOptions" />
							<ZInputProductVariantList
								:options="product.options"
								:variants="product.variants"
								:product="product"
								@delete:variant="deleteProductVariant"
								@update:variants="updateProductVariants"
							/>
						</div>
					</div>
				</template>

				<!-- <template #shipping>
					<h1>Shipping</h1>
				</template> -->

				<template #tax>
					<h1>Tax</h1>
				</template>
			</UTabs>
		</div>
		<!-- MOBILE -->
	</UCard>
</template>

<script lang="ts" setup>
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { ProductOptionInput, ProductVariantInput } from '~/utils/types/product';

const vertical_ui_tabs = {
	wrapper: 'flex items-start gap-2',
	container: 'relative w-full h-[550px] max-h-[550px] overflow-hidden overflow-y-auto scrollbar-hide bg-neutral-100 p-4 rounded-md',
	list: {
		width: 'w-80',
		rounded: 'rounded-md',
		tab: {
			base: 'relative inline-flex items-center justify-start flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
			height: 'h-12',
		},
	},
};

const normal_ui_tabs = {
	container: 'relative w-full h-[550px] max-h-[550px] overflow-hidden overflow-y-auto scrollbar-hide bg-neutral-100 p-4 rounded-md',
	list: {
		rounded: 'rounded-md',
		height: 'h-12',
		tab: {
			base: 'relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
			height: 'h-10',
		},
	},
};

const props = defineProps({
	product: {
		type: Object as PropType<Product>,
		required: true,
	},
	hideHeader: {
		type: Boolean,
		default: false,
	},
	cardUi: Object,
});

const emit = defineEmits(['update:options', 'update:variants', 'delete:variant', 'update:metadata']);
const product = computed({
	get() {
		return props.product;
	},
	set(_) {},
});

const product_additional_info = computed(() => {
	return [
		// Conditionally add maintenance for type 2
		...(product.value.type === 2 ? [{ label: '*Maintenance', slot: 'maintenance' }] : []),
		// Always add these items
		{ label: 'Variants', slot: 'variants' },
		// { label: 'Shipping', slot: 'shipping' },
		{ label: 'Tax', slot: 'tax' },
	];
});
const updateProductOptions = (value: ProductOptionInput[]) => {
	emit('update:options', value);
};

const updateProductVariants = (value: ProductVariantInput[]) => {
	emit('update:variants', value);
};

const deleteProductVariant = (value: ProductVariantInput) => {
	emit('delete:variant', value);
};

const updateProductMetadata = (value: Record<string, unknown>) => {
	emit('update:metadata', value);
};
</script>

<style scoped>
h2 {
	line-height: 1.25;
}

p {
	color: var(--color-secondary-400);
	line-height: 1.25;
	margin-top: 0.25rem;
}
</style>
