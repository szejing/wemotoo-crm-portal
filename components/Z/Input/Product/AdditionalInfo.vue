<template>
	<UCard>
		<template #header>
			<h2>Additional Info</h2>
		</template>

		<!-- DESKTOP -->
		<div class="hidden sm:block">
			<UTabs :items="product_additional_info" orientation="vertical" :ui="vertical_ui_tabs">
				<template #default="{ item, selected }">
					<h4 class="text-start truncate" :class="[selected && 'text-primary-500']">{{ item.label }}</h4>
				</template>

				<template #variants>
					<div class="flex flex-col h-full">
						<h1>Variants</h1>
						<p>Add variations of this product. Offer your customers different options for color, format, size, shape, etc.</p>

						<div class="space-y-4 mt-4">
							<ZInputProductOptions v-model:options="newProduct.options" @update:product-options="updateProductOptions" />
							<ZInputProductVariants
								:options="newProduct.options"
								:variants="newProduct.variants"
								:product="newProduct"
								@update:product-variants="updateProductVariants"
							/>
						</div>
					</div>
				</template>

				<template #shipping>
					<h1>Shipping</h1>
				</template>

				<template #tax>
					<h1>Tax</h1>
				</template>
			</UTabs>
		</div>
		<!-- DESKTOP -->

		<!-- MOBILE -->
		<div class="sm:hidden">
			<UTabs :items="product_additional_info" :ui="normal_ui_tabs">
				<template #default="{ item, selected }">
					<h4 class="text-start truncate" :class="[selected && 'text-primary-500']">{{ item.label }}</h4>
				</template>

				<template #variants>
					<div class="flex flex-col h-full">
						<h1>Variants</h1>
						<p>Add variations of this product. Offer your customers different options for color, format, size, shape, etc.</p>

						<div class="space-y-4 mt-4">
							<ZInputProductOptions :options="newProduct.options" @update:product-options="updateProductOptions" />
							<ZInputProductVariants
								:options="newProduct.options"
								:variants="newProduct.variants"
								:product="newProduct"
								@update:product-variants="updateProductVariants"
							/>
						</div>
					</div>
				</template>

				<template #shipping>
					<h1>Shipping</h1>
				</template>

				<template #tax>
					<h1>Tax</h1>
				</template>
			</UTabs>
		</div>
		<!-- MOBILE -->
	</UCard>
</template>

<script lang="ts" setup>
import { useProductStore } from '~/stores/Products/Products';

const product_additional_info = [
	{
		label: 'Variants',
		slot: 'variants',
	},
	{
		label: 'Shipping',
		slot: 'shipping',
	},
	{
		label: 'Tax',
		slot: 'tax',
	},
];

const vertical_ui_tabs = {
	wrapper: 'flex items-start gap-2',
	container: 'relative w-full h-[450px] max-h-[450px] overflow-hidden overflow-y-auto scrollbar-hide bg-gray-100 p-4 rounded-md',
	list: {
		width: 'w-80',
		rounded: 'rounded-md',
		tab: {
			base: 'relative inline-flex items-center justify-start flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
			height: 'h-12',
		},
	},
};

const normal_ui_tabs = {
	container: 'relative w-full h-[450px] max-h-[450px] overflow-hidden overflow-y-auto scrollbar-hide bg-gray-100 p-4 rounded-md',
	list: {
		rounded: 'rounded-md',
		height: 'h-12',
		tab: {
			base: 'relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
			height: 'h-10',
		},
	},
};

const productStore = useProductStore();
const { newProduct } = storeToRefs(productStore);

const updateProductOptions = (value: any) => {
	newProduct.value.options = value;
};

const updateProductVariants = (value: any) => {
	newProduct.value.variants = value;
};
</script>

<style scoped lang="css">
h2 {
	@apply leading-tight;
}

p {
	@apply text-secondary-400 leading-tight mt-1;
}
</style>
