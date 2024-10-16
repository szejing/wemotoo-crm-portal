<template>
	<UCard :ui="cardUi">
		<template #header>
			<div class="w-full flex-between items-center">
				<h2>Inventory</h2>
				<div class="w-[50%] flex-jend items-center gap-4">
					<UCheckbox v-model="variantDetail.manage_inventory" name="manageInventory" label="Manage Inventory" color="green" />
				</div>
			</div>
		</template>

		<div v-if="variantDetail.manage_inventory" class="section-grid-basic-details">
			<UFormGroup v-slot="{ error }" label="Sku" name="sku">
				<UInput v-model="variantDetail.sku" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Quantity" name="quantity">
				<UInput v-model="variantDetail.inventory_quantity" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" type="number" />
			</UFormGroup>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { ProductVariant } from '~/utils/types/product-variant';

const props = defineProps({
	details: {
		type: Object as PropType<ProductVariant>,
		required: true,
	},
	cardUi: Object,
});
const emit = defineEmits(['update:variantDetail']);

const variantDetail = computed({
	get() {
		return props.details ?? [];
	},
	set(value) {
		emit('update:variantDetail', value);
	},
});
</script>

<style>
.section-grid-basic-details {
	@apply grid grid-cols-2 gap-4;
}
</style>
