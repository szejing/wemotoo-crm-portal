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

const props = defineProps<{ status: ProductStatus }>();

const emit = defineEmits(['update:status']);

const status = computed({
	get() {
		return props.status;
	},
	set(value) {
		emit('update:status', value);
	},
});
</script>

<style scoped lang="css"></style>
