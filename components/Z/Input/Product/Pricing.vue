<template>
	<UCard :ui="cardUi">
		<template #header>
			<h2>Pricing</h2>
			<div class="section-grid-price-details mt-4">
				<UFormGroup label="Currency" name="currency">
					<ZSelectMenuCurrency v-model:currency="currency" />
				</UFormGroup>
			</div>
		</template>

		<div class="section-grid-price-details gap-4 mt-4">
			<UFormGroup v-slot="{ error }" label="Selling Price" name="origSellPrice" required>
				<UInput
					v-model="origSellPrice"
					:trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined"
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
					:trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined"
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
					:trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined"
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
import { fractionDigits } from '~/utils/utils';

const props = defineProps({
	currency: String,
	sellingPrice: Number,
	costPrice: Number,
	salePrice: Number,
	cardUi: Object,
});

const emit = defineEmits(['update:currency', 'update:sellingPrice', 'update:costPrice', 'update:salePrice']);

const currency = computed({
	get(): string | undefined {
		return props.currency;
	},
	set(value) {
		emit('update:currency', value);
	},
});

const origSellPrice = computed({
	get(): string | undefined {
		return props.sellingPrice?.toFixed(fractionDigits);
	},
	set(value) {
		emit('update:sellingPrice', value);
	},
});

const costPrice = computed({
	get(): string | undefined {
		return props.costPrice?.toFixed(fractionDigits);
	},
	set(value) {
		emit('update:costPrice', value);
	},
});

const salePrice = computed({
	get(): string | undefined {
		return props.salePrice?.toFixed(fractionDigits);
	},
	set(value) {
		emit('update:salePrice', value);
	},
});
const formatCurrencyInput = (input: string, event: any) => {
	if (event instanceof HTMLInputElement) {
		let value = input.replace(/\D/g, ''); // Remove non-numeric characters
		let cursorLength = value.length;
		if (value.length > 0) {
			value = formatCurrency(parseFloat(value), fractionDigits);
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
	@apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4;
}
</style>
