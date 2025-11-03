<template>
	<UCalendar v-model="internalDate" :min-value="minDateValue" :max-value="maxDateValue" />
</template>

<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	modelValue: {
		type: Date as PropType<Date | null>,
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

// Convert JavaScript Date to CalendarDate
const dateToCalendarDate = (date: Date | null): DateValue | undefined => {
	if (!date) return undefined;
	return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

// Convert CalendarDate to JavaScript Date
const calendarDateToDate = (calendarDate: DateValue | undefined): Date | null => {
	if (!calendarDate) return null;
	return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
};

const minDateValue = computed(() => dateToCalendarDate(props.minDate));
const maxDateValue = computed(() => dateToCalendarDate(props.maxDate));

const internalDate = computed({
	get: () => dateToCalendarDate(props.modelValue),
	set: (value) => {
		const jsDate = calendarDateToDate(value);
		emit('update:model-value', jsDate);
		emit('close');
	},
});
</script>
