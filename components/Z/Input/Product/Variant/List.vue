<template>
	<div class="space-y-2">
		<div class="flex-jbetween-icenter">
			<h3>Variations</h3>
			<UButton v-if="prodOptions?.length > 0 && totalPossibleVariants > prodVariants.length" color="green" variant="ghost" @click="autoGenerate">
				Auto Generate
			</UButton>

			<UButton v-if="prodVariants.length > 0" color="green" variant="ghost" @click="autoGenerate">Update</UButton>
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

		<UModal v-if="variantDetail" v-model="isVariantDetailsModalOpen">
			<ZInputProductVariantDetails :product="props.product" :details="variantDetail" @update:variant-detail="updateVariantDetail" />
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import type { ProdOptionInput, ProdOptionValuesInput, Product, ProdVariantInput } from '~/utils/types/product';

const isVariantDetailsModalOpen = ref(false);
const variantDetail = ref<ProdVariantInput>();
const props = defineProps<{ product: Product; options: ProdOptionInput[] | undefined; variants: ProdVariantInput[] | undefined }>();
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
	return prodOptions.value.reduce((acc, option) => acc * option?.values!.length, 1);
});

const autoGenerate = () => {
	if (prodOptions.value.length === 0) return;
	const variants: ProdVariantInput[] = [];

	const combine = (currentOptions: ProdOptionValuesInput[], optionIndex: number) => {
		if (optionIndex === prodOptions.value.length) {
			variants.push({ options: [...currentOptions] });
			return;
		}

		const option = prodOptions.value[optionIndex];
		for (const value of option.values!) {
			combine([...currentOptions, { id: value.id, value: value.value }], optionIndex + 1);
		}
	};

	combine([], 0);

	variants.forEach((variant) => {
		if (variant.name) return;

		variant.name = variant.options?.map((option) => option.value).join('_');
		variant.id = props.product.code + '_' + variant.name;

		if (variant.price_types) return;

		if (props.product.price_types) {
			variant.price_types = [JSON.parse(JSON.stringify(props.product.price_types[0]))];
		} else {
			variant.price_types = undefined;
		}
	});

	prodVariants.value = variants;
};

const addVariant = () => {
	// options.value.push({
	// 	name: '',
	// 	values: [],
	// });
};

const viewVariant = (variant: ProdVariantInput) => {
	isVariantDetailsModalOpen.value = true;
	variantDetail.value = variant;
};

const updateVariantDetail = (variant: ProdVariantInput) => {
	isVariantDetailsModalOpen.value = false;
	const index = prodVariants.value.findIndex((v: ProdVariantInput) => v.name === variant.name); // Find variant by name
	if (index !== -1) {
		prodVariants.value[index] = { ...variant }; // Replace all details of the found variant
	}
};
</script>

<style scoped lang="css"></style>
