<template>
	<div class="section-grid-basic-details">
		<UFormField label="Payment Date" name="paymentDate">
			<ZSelectMenuDateTime :date-time="paymentDateTime" placeholder="Payment Date" @update:date-time="paymentDateTime = $event" />
		</UFormField>

		<!-- // Date selection -->
		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<UFormField label="Payment Type" name="paymentType">
				<ZSelectMenuPaymentType v-model:payment-type-code="paymentTypeCode" v-model:currency-code="currencyCode" />
			</UFormField>

			<UFormField v-slot="{ error }" :label="`Payment Amount (${currencyCode})`" name="paymentAmount" required>
				<UInput v-model="paymentAmount" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Payment Amount" disabled />
			</UFormField>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<UFormField v-slot="{ error }" label="Ref No. 1" name="refNo1">
				<UInput v-model="refNo1" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Ref No. 1" />
			</UFormField>

			<UFormField v-slot="{ error }" label="Ref No. 2" name="refNo2">
				<UInput v-model="refNo2" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Ref No. 2" />
			</UFormField>
		</div>

		<!-- // add table to allow meta data (key, value) -->
	</div>
</template>

<script lang="ts" setup>
import { ZSelectMenuDateTime } from '#components';

const props = defineProps({
	paymentDateTime: Date,
	paymentTypeCode: String,
	refNo1: String,
	refNo2: String,
	paymentAmount: Number,
	currencyCode: String,
	externalIntgType: Number,
	// metadata: Object as PropType<Record<string, unknown>>,
});

const emit = defineEmits([
	'update:paymentDateTime',
	'update:paymentTypeCode',
	'update:refNo1',
	'update:refNo2',
	'update:paymentAmount',
	'update:currencyCode',
	'update:externalIntgType',
]);

const paymentDateTime = computed({
	get() {
		return props.paymentDateTime;
	},
	set(value) {
		emit('update:paymentDateTime', value);
	},
});

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
		return props.paymentAmount?.toFixed(2);
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

<style scoped>
.section-grid-basic-details {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 0.75rem;
}
</style>
