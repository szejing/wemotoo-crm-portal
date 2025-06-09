<template>
	<UPopover :popper="{ placement: 'bottom-start' }">
		<UButton icon="i-heroicons-calendar-days-20-solid" :label="dateRangeLabel" variant="outline" />

		<template #panel="{ close }">
			<ZDateRangePicker v-model="dateRange" :min-date="minDate" :max-date="maxDate" @close="close" />
		</template>
	</UPopover>
</template>

<script lang="ts" setup>
import { getFormattedDate } from 'wemotoo-common';
import type { DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker.js';

const props = defineProps<{ startDate: Date | undefined; endDate: Date | undefined; placeholder: string; minDate?: Date; maxDate?: Date }>();

const maxDate = computed(() => {
	if (props.maxDate) {
		return props.maxDate;
	}

	return new Date();
});

const emit = defineEmits(['update:start-date', 'update:end-date']);

const dateRange = computed({
	get(): DatePickerRangeObject | null {
		if (props.startDate && props.endDate) {
			return {
				start: props.startDate,
				end: props.endDate,
			};
		} else if (props.startDate) {
			return {
				start: props.startDate,
				end: props.startDate,
			};
		}
		return null;
	},
	set(range: DatePickerRangeObject | null) {
		if (range?.start && range?.end) {
			emit('update:start-date', range.start);
			emit('update:end-date', range.end);
		}
	},
});

const dateRangeLabel = computed(() => {
	if (props.startDate && props.endDate) {
		const startFormatted = getFormattedDate(props.startDate, 'dd/MM/yyyy');
		const endFormatted = getFormattedDate(props.endDate, 'dd/MM/yyyy');
		if (startFormatted === endFormatted) {
			return startFormatted;
		}
		return `${startFormatted} - ${endFormatted}`;
	} else if (props.startDate) {
		return getFormattedDate(props.startDate, 'dd/MM/yyyy');
	}
	return props.placeholder;
});
</script>

<style scoped lang="postcss"></style>
