<template>
	<div class="section-grid-basic-details">
		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<UFormGroup label="Payment Type" name="paymentType">
				<ZSelectMenuPaymentType v-model:payment-type-code="paymentTypeCode" v-model:currency-code="currencyCode" />
			</UFormGroup>

			<ZSelectMenuDate :date="paymentDate" placeholder="Payment Date" @update:date="paymentDate = $event" />
		</div>

		<!-- // Date selection -->
		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<h1>{{ currencyCode }}</h1>

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

		<!-- // add table to allow meta data (key, value) -->
	</div>
</template>

<script lang="ts" setup>
const paymentDate = ref(new Date());

const props = defineProps({
	paymentTypeCode: String,
	refNo1: String,
	refNo2: String,
	paymentAmount: Number,
	currencyCode: String,
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
