<template>
	<UCard>
		<template #header>
			<h2>Pricing</h2>
			<div class="section-grid-price-details mt-4">
				<UFormGroup label="Currency" name="currency">
					<ZSelectMenuCurrency />
				</UFormGroup>
			</div>
		</template>

		<div class="section-grid-price-details gap-4 mt-4">
			<UFormGroup v-slot="{ error }" label="Selling Price" name="origSellPrice" required>
				<UInput
					v-model="origSellPrice"
					:trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
					placeholder="0.00"
					@input="formatCurrencyInput($event.target.value, $event.target)"
				>
					<template #leading>
						<h3>RM</h3>
					</template>
				</UInput>
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Cost Price" name="costPrice">
				<UInput
					v-model="costPrice"
					:trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
					placeholder="0.00"
					@input="formatCurrencyInput($event.target.value, $event.target)"
				>
					<template #leading>
						<h3>RM</h3>
					</template>
				</UInput>
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Sale Price" name="salePrice">
				<UInput
					v-model="salePrice"
					:trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
					placeholder="0.00"
					@input="formatCurrencyInput($event.target.value, $event.target)"
				>
					<template #leading>
						<h3>RM</h3>
					</template>
				</UInput>
			</UFormGroup>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	productSellingPrice: String,
	productCostPrice: String,
	productSalePrice: String,
});

const emit = defineEmits(['update:productSellingPrice', 'update:productCostPrice', 'update:productSalePrice']);

const origSellPrice = computed({
	get() {
		return props.productSellingPrice;
	},
	set(value) {
		emit('update:productSellingPrice', value);
	},
});

const costPrice = computed({
	get() {
		return props.productCostPrice;
	},
	set(value) {
		emit('update:productCostPrice', value);
	},
});

const salePrice = computed({
	get() {
		return props.productSalePrice;
	},
	set(value) {
		emit('update:productSalePrice', value);
	},
});
const formatCurrencyInput = (input: string, event: any) => {
	if (event instanceof HTMLInputElement) {
		let value = input.replace(/\D/g, ''); // Remove non-numeric characters
		let cursorLength = value.length;
		if (value.length > 0) {
			value = formatCurrency(parseFloat(value), 2);
			cursorLength = value.length;
		}
		event.focus();
		event.setSelectionRange(cursorLength, cursorLength);
		event.value = value;
	}
};
</script>

<style scoped lang="css">
.section-grid-price-details {
	@apply grid grid-cols-3 gap-4;
}
</style>
