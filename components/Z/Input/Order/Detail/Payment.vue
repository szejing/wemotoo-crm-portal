<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Payment Type Code" name="paymentTypeCode" required>
			<UInput v-model="paymentTypeCode" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Payment Type Code" />
		</UFormGroup>

		<!-- <UFormGroup v-slot="{ error }" label="Payment Type Description" name="paymentTypeDesc" required>
			<UInput v-model="paymentTypeDesc" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Payment Type Description" />
		</UFormGroup> -->

		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<UFormGroup label="Currency" name="currency">
				<ZSelectMenuCurrency v-model:currency-code="currencyCode" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" :label="`Payment Amount (${currencyCode})`" name="paymentAmount" required>
				<UInput v-model="paymentAmount" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Payment Amount" />
			</UFormGroup>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<UFormGroup v-slot="{ error }" label="Ref No. 1" name="refNo1" required>
				<UInput v-model="refNo1" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Ref No. 1" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Ref No. 2" name="refNo2" required>
				<UInput v-model="refNo2" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Ref No. 2" />
			</UFormGroup>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<UFormGroup v-slot="{ error }" label="External Integration Type" name="externalIntgType" required>
				<UInput v-model="externalIntgType" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="External Integration Type" />
			</UFormGroup>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	paymentTypeCode: String,
	refNo1: String,
	refNo2: String,
	paymentAmount: Number,
	currencyCode: String,
	externalIntgType: Number,
	// metadata: Object as PropType<Record<string, unknown>>,
});

const emit = defineEmits([
	'update:paymentTypeCode',
	'update:refNo1',
	'update:refNo2',
	'update:paymentAmount',
	'update:currencyCode',
	'update:externalIntgType',
	// 'update:metadata',
]);

const paymentTypeCode = computed({
	get() {
		return props.paymentTypeCode;
	},
	set(value) {
		emit('update:paymentTypeCode', value);
	},
});

const refNo1 = computed({
	get() {
		return props.refNo1;
	},
	set(value) {
		emit('update:refNo1', value);
	},
});

const refNo2 = computed({
	get() {
		return props.refNo2;
	},
	set(value) {
		emit('update:refNo2', value);
	},
});

const paymentAmount = computed({
	get() {
		return props.paymentAmount;
	},
	set(value) {
		emit('update:paymentAmount', value);
	},
});

const currencyCode = computed({
	get() {
		return props.currencyCode;
	},
	set(value) {
		emit('update:currencyCode', value);
	},
});

const externalIntgType = computed({
	get() {
		return props.externalIntgType;
	},
	set(value) {
		emit('update:externalIntgType', value);
	},
});

// const metadata = computed({
// 	get() {
// 		return props.metadata;
// 	},
// 	set(value) {
// 		emit('update:metadata', value);
// 	},
// });
</script>

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
