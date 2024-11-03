<template>
	<UCard :ui="cardUi">
		<template #header>
			<div class="w-full flex-between items-center">
				<h2>General Info</h2>
				<div class="w-[50%] flex-jend items-center gap-4">
					<!-- <UCheckbox v-model="variantDetail.manage_inventory" name="manageInventory" label="Manage Inventory" color="green" /> -->
					<UCheckbox v-model="variantDetail.allow_backorder" name="allowBackorder" label="Allow Backorder" color="green" />

					<!-- <UCheckbox v-model="is_discountable" name="isDiscountable" label="Discountable" color="green" />
					<UCheckbox v-model="is_giftcard" name="isGiftCard" label="Giftcard" color="green" /> -->
				</div>
			</div>
		</template>

		<div class="section-grid-basic-details">
			<!-- <UFormGroup v-slot="{ error }" label="Product Code" name="code" required>
				<UInput v-model="variantDetail.hs_code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Subtitle" name="subtitle">
				<UInput v-model="variantDetail.barcode" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Subtitle" name="subtitle">
				<UInput v-model="variantDetail.ean" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
			</UFormGroup> -->
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
