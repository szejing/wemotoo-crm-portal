<template>
	<div
		class="shrink-0 w-14 sm:w-16 text-right text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700"
		:style="{ height: `${totalHeightPx}px`, minHeight: `${totalHeightPx}px` }"
	>
		<div
			v-for="(slot, i) in slotRows"
			:key="i"
			class="flex w-full items-center justify-center pt-1 leading-tight"
			:style="{ height: `${slotHeightPx}px`, minHeight: `${slotHeightPx}px` }"
		>
			{{ slot.label }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useCalendarTimeSlots } from '~/composables/useCalendarTimeSlots';

const props = withDefaults(
	defineProps<{
		startHour?: number;
		endHour?: number;
		slotHeightPx?: number;
	}>(),
	{
		startHour: 6,
		endHour: 22,
		slotHeightPx: 24,
	},
);

const { totalHeightPx, slotHeightPx, slotRows } = useCalendarTimeSlots(() => ({
	startHour: props.startHour,
	endHour: props.endHour,
	slotHeightPx: props.slotHeightPx,
}));
</script>
