<template>
	<VCalendarDatePicker v-model.range="date" :columns="2" v-bind="{ ...attrs, ...$attrs }" :min-date="minDate" :max-date="maxDate" @dayclick="onDayClick" />
</template>

<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';
import type { DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker.js';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	modelValue: {
		type: Object as PropType<DatePickerRangeObject | null>,
		default: null,
	},
	minDate: {
		type: Date,
		default: null,
	},
	maxDate: {
		type: Date,
		default: null,
	},
});

const emit = defineEmits(['update:model-value', 'close']);

const date = computed({
	get: () => props.modelValue,
	set: (value: DatePickerRangeObject | null) => {
		emit('update:model-value', value);
		// Only emit close when both start and end dates are selected
		if (value?.start && value?.end) {
			emit('close');
		}
	},
});

const attrs = {
	'transparent': true,
	'borderless': true,
	'color': 'primary',
	'is-dark': { selector: 'html', darkClass: 'dark' },
	'first-day-of-week': 2,
};

function onDayClick(_: any, event: MouseEvent): void {
	const target = event.target as HTMLElement;
	target.blur();
}
</script>

<style>
:root {
	--vc-gray-50: rgb(var(--color-gray-50));
	--vc-gray-100: rgb(var(--color-gray-100));
	--vc-gray-200: rgb(var(--color-gray-200));
	--vc-gray-300: rgb(var(--color-gray-300));
	--vc-gray-400: rgb(var(--color-gray-400));
	--vc-gray-500: rgb(var(--color-gray-500));
	--vc-gray-600: rgb(var(--color-gray-600));
	--vc-gray-700: rgb(var(--color-gray-700));
	--vc-gray-800: rgb(var(--color-gray-800));
	--vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
	--vc-accent-50: rgb(var(--color-primary-50));
	--vc-accent-100: rgb(var(--color-primary-100));
	--vc-accent-200: rgb(var(--color-primary-200));
	--vc-accent-300: rgb(var(--color-primary-300));
	--vc-accent-400: rgb(var(--color-primary-400));
	--vc-accent-500: rgb(var(--color-primary-500));
	--vc-accent-600: rgb(var(--color-primary-600));
	--vc-accent-700: rgb(var(--color-primary-700));
	--vc-accent-800: rgb(var(--color-primary-800));
	--vc-accent-900: rgb(var(--color-primary-900));
}
</style>
