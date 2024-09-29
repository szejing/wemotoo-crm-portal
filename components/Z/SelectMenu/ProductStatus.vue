<template>
	<UFormGroup name="status" class="mt-2">
		<USelectMenu v-model="status" :options="options_product_status" size="md" option-attribute="value" value-attribute="value">
			<template #label>
				<span>{{ capitalizeFirstLetter(status) }}</span>
			</template>

			<template #option="{ option: optionStatus }">
				<span class="truncate">{{ capitalizeFirstLetter(optionStatus.value) }}</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { ProductStatus } from '~/utils/enum/product-status';
import { options_product_status } from '~/utils/options';

const props = defineProps<{ productStatus: ProductStatus }>();

const emit = defineEmits(['update:productStatus']);

const status = computed({
	get() {
		return props.productStatus;
	},
	set(value) {
		emit('update:productStatus', value);
	},
});
</script>

<style scoped lang="css"></style>
