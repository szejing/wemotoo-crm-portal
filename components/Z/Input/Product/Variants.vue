<template>
	<div class="space-y-2">
		<div class="flex-jbetween-icenter">
			<h3>Variations</h3>
			<UButton v-if="prodOptions?.length > 0 && totalPossibleVariants > prodVariants.length" color="green" variant="ghost" @click="autoGenerate">
				Auto Generate
			</UButton>
		</div>

		<div v-for="(variant, index) in prodVariants" :key="index">
			<ZInputProductVariant :variant="variant" @view:productvariant="viewVariant" />
		</div>
		<UButton
			v-if="totalPossibleVariants > prodVariants.length"
			color="primary"
			block
			variant="outline"
			:disabled="prodOptions?.length == 0"
			@click="addVariant"
		>
			Add Variant
		</UButton>

		<UModal v-model="isVariantDetailsModalOpen">
			<div class="p-4">
				<h1>{{ variantDetail?.title }}</h1>
			</div>
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import type { Product } from '~/utils/types/product';
import type { ProductOption } from '~/utils/types/product-option';
import type { ProductVariant } from '~/utils/types/product-variant';

const isVariantDetailsModalOpen = ref(false);
const variantDetail = ref<ProductVariant>();
const props = defineProps<{ product: Product; options: ProductOption[] | undefined; variants: ProductVariant[] | undefined }>();
const emit = defineEmits(['update:productVariants']);

const prodOptions = computed({
	get() {
		return props.options ?? [];
	},
	set(_) {},
});

const prodVariants = computed({
	get() {
		return props.variants ?? [];
	},
	set(value) {
		emit('update:productVariants', value);
	},
});

const totalPossibleVariants = computed(() => {
	return prodOptions.value.reduce((acc, option) => acc * option.values.length, 1);
});

const autoGenerate = () => {
	if (prodOptions.value.length === 0) return;
	const variants: ProductVariant[] = [];

	const combine = (currentOptions: ProductOption[], optionIndex: number) => {
		if (optionIndex === prodOptions.value.length) {
			variants.push({ options: [...currentOptions] });
			return;
		}

		const option = prodOptions.value[optionIndex];
		for (const value of option.values) {
			combine([...currentOptions, { name: option.name, values: [value] }], optionIndex + 1);
		}
	};

	combine([], 0);

	variants.forEach((variant) => {
		if (variant.title) return;

		variant.title = variant.options?.map((option) => option.values[0]).join('_');

		if (variant.price || !props.product.price?.origSellPrice) return;

		variant.price = [props.product.price];

		console.log(variant);
	});

	prodVariants.value = variants;
};

const addVariant = () => {
	// options.value.push({
	// 	name: '',
	// 	values: [],
	// });
};

const viewVariant = (variant: ProductVariant) => {
	isVariantDetailsModalOpen.value = true;
	variantDetail.value = variant;
};
</script>

<style scoped lang="css"></style>
