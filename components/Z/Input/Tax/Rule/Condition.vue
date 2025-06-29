<template>
	<div class="space-y-4">
		<!-- <div class="flex-jbetween-icenter">
			<h4 class="text-neutral-700 text-sm">Code <span class="text-red-500">*</span></h4>

			<UFormGroup v-slot="{ error }" name="code" :required="!isUpdate">
				<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Code" :disabled="isUpdate" />
			</UFormGroup>
		</div> -->

		<div class="flex-jbetween-icenter">
			<h4 class="text-neutral-700 text-sm">Amount Type<span class="text-red-500">*</span></h4>
			<ZSelectMenuAmountType :amount-type="amountType" @update:amount-type="amountType = $event" />
		</div>

		<div class="flex-jbetween-icenter">
			<h4 class="text-neutral-700 text-sm">Rate (%) <span class="text-red-500">*</span></h4>
			<UFormGroup v-slot="{ error }" name="rate" required>
				<UInput v-model="rate" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Rate" />
			</UFormGroup>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<UFormGroup label="Start Date" name="startDate">
				<ZSelectMenuDate :date="startDate" placeholder="Start Date" @update:date="startDate = $event" />
			</UFormGroup>

			<UFormGroup label="End Date" name="endDate">
				<ZSelectMenuDate :date="endDate" placeholder="End Date" @update:date="endDate = $event" />
			</UFormGroup>
		</div>

		<!-- <div class="grid grid-cols-2 gap-4">
			<UFormGroup label="Min Amount" name="minAmount">
				<UInput v-model="minAmount" placeholder="Min Amount" />
			</UFormGroup>

			<UFormGroup label="Max Amount" name="maxAmount">
				<UInput v-model="maxAmount" placeholder="Max Amount" />
			</UFormGroup>
		</div> -->
	</div>
</template>

<script lang="ts" setup>
import type { FilterCondition, FilterOperator } from 'wemotoo-common';

const props = defineProps<{
	// taxCode?: string;
	startDate?: Date | undefined;
	endDate?: Date | undefined;
	amountType?: string;
	rate?: number;
	minAmount?: number;
	maxAmount?: number;
	filters?: Array<{
		filter_operator: FilterOperator;
		filter_condition: FilterCondition;
		filter_value: string;
	}>;
	isUpdate?: boolean;
}>();

const emit = defineEmits([
	// 'update:code',
	'update:start-date',
	'update:end-date',
	'update:amount-type',
	'update:rate',
	// 'update:minAmount',
	// 'update:maxAmount',
	// 'update:filters',
]);

// const code = computed({
// 	get() {
// 		return props.code;
// 	},
// 	set(value) {
// 		emit('update:code', value?.toUpperCase());
// 	},
// });

const startDate = computed({
	get() {
		return props.startDate;
	},
	set(value) {
		emit('update:start-date', value);
	},
});

const endDate = computed({
	get() {
		return props.endDate;
	},
	set(value) {
		emit('update:end-date', value);
	},
});

const amountType = computed({
	get() {
		return props.amountType;
	},
	set(value) {
		emit('update:amount-type', value);
	},
});

const rate = computed({
	get() {
		if (props.rate) {
			return props.rate * 100;
		}
		return undefined;
	},
	set(value) {
		emit('update:rate', value ? Number(value / 100) : undefined);
	},
});

// const minAmount = computed({
// 	get() {
// 		return props.minAmount;
// 	},
// 	set(value) {
// 		emit('update:minAmount', value);
// 	},
// });

// const maxAmount = computed({
// 	get() {
// 		return props.maxAmount;
// 	},
// 	set(value) {
// 		emit('update:maxAmount', value);
// 	},
// });

// const filters = computed({
// 	get() {
// 		return props.filters;
// 	},
// 	set(value) {
// 		emit('update:filters', value);
// 	},
// });
</script>

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
