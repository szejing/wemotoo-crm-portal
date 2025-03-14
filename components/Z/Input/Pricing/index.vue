<template>
	<UCard :ui="cardUi">
		<template #header>
			<h2>Pricing</h2>
			<div class="section-grid-price-details mt-4">
				<UFormGroup label="Currency" name="currency">
					<ZSelectMenuCurrency v-model:currency-code="currency_code" />
				</UFormGroup>
			</div>
		</template>

		<div class="section-grid-price-details gap-4 mt-4">
			<UFormGroup v-slot="{ error }" label="Selling Price" name="orig_sell_price" required>
				<UInput
					v-model="orig_sell_price"
					:trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined"
					placeholder="0.00"
					@input="formatCurrencyInput($event.target.value, $event.target)"
				>
					<template #leading>
						<h3>RM</h3>
					</template>
				</UInput>
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Cost Price" name="cost_price">
				<UInput
					v-model="cost_price"
					:trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined"
					placeholder="0.00"
					@input="formatCurrencyInput($event.target.value, $event.target)"
				>
					<template #leading>
						<h3>RM</h3>
					</template>
				</UInput>
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Sale Price" name="sale_price">
				<UInput
					v-model="sale_price"
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
	currencyCode: String,
	origSellPrice: Number,
	costPrice: Number,
	salePrice: Number,
	cardUi: Object,
});

const emit = defineEmits(['update:currencyCode', 'update:origSellPrice', 'update:costPrice', 'update:salePrice']);

const currency_code = computed({
	get(): string | undefined {
		return props.currencyCode;
	},
	set(value) {
		emit('update:currencyCode', value);
	},
});

const orig_sell_price = computed({
	get(): string | undefined {
		return props.origSellPrice == null ? undefined : props.origSellPrice?.toFixed(fractionDigits);
	},
	set(value) {
		emit('update:origSellPrice', value);
	},
});

const cost_price = computed({
	get(): string | undefined {
		return props.costPrice == null ? undefined : props.costPrice?.toFixed(fractionDigits);
	},
	set(value) {
		emit('update:costPrice', value);
	},
});

const sale_price = computed({
	get(): string | undefined {
		return props.salePrice == null ? undefined : props.salePrice?.toFixed(fractionDigits);
	},
	set(value) {
		emit('update:salePrice', value);
	},
});

if (orig_sell_price.value == undefined) {
	orig_sell_price.value = undefined;
}

if (cost_price.value == undefined) {
	cost_price.value = undefined;
}

if (sale_price.value == undefined) {
	sale_price.value = undefined;
}

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

<style scoped lang="postcss">
.section-grid-price-details {
	@apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4;
}
</style>
