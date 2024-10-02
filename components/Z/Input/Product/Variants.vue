<template>
	<div class="space-y-2">
		<div class="flex-jbetween-icenter">
			<h3>Variations</h3>
			<UButton v-if="prodOptions?.length > 0" color="green" variant="ghost" @click="addVariant"> Auto Generate </UButton>
		</div>
		<UButton color="primary" block variant="outline" :disabled="prodOptions?.length == 0" @click="addVariant"> Add Variant </UButton>
	</div>
</template>

<script lang="ts" setup>
import type { ProductOption } from '~/utils/types/product-option';
import type { ProductVariant } from '~/utils/types/product-variant';

const props = defineProps<{ options: ProductOption[] | undefined; variants: ProductVariant[] | undefined }>();
const emit = defineEmits(['update:productVariant']);

const prodOptions = computed({
	get() {
		return props.options ?? [];
	},
	set(_) {},
});

const prodVariants = computed({
	get() {
		return props.options ?? [];
	},
	set(value) {
		emit('update:productVariant', value);
	},
});

const addVariant = () => {
	// options.value.push({
	// 	name: '',
	// 	values: [],
	// });
};
</script>

<style scoped lang="css"></style>
