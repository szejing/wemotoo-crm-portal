<template>
	<div class="space-y-2">
		<h3>Variations</h3>
		<UButton color="primary" block variant="outline" :disabled="options.length == 0 || options[0].name == ''" @click="addVariant"> Add Variant </UButton>
	</div>
</template>

<script lang="ts" setup>
import type { ProductOption } from '~/utils/types/product-option';

const options = ref<ProductOption[]>([]);

const addVariant = () => {
	// options.value.push({
	// 	name: '',
	// 	values: [],
	// });
};
</script>

<style scoped lang="css"></style>
