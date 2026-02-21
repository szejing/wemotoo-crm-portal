<template>
	<div class="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-default items-stretch">
		<ZCalendarTimeAxis :start-hour="startHour" :end-hour="endHour" :slot-height-px="slotHeightPx" />
		<!-- Day column with time grid: hour = stronger solid, 30-min = dotted -->
		<div class="flex-1 min-w-0 relative" :style="{ minHeight: `${totalHeightPx}px` }">
			<div class="absolute inset-0 flex flex-col">
				<div
					v-for="h in totalSlots"
					:key="h"
					:class="[
						'shrink-0',
						(h - 1) % 2 === 0 ? 'border-b-2 border-gray-200 dark:border-gray-600' : 'border-b border-dotted border-gray-100 dark:border-gray-800',
					]"
					:style="{ height: `${slotHeightPx}px`, minHeight: `${slotHeightPx}px` }"
				/>
			</div>
			<!-- Appointments positioned by time -->
			<div
				v-for="block in positionedBlocks"
				:key="block.appointment.code"
				class="absolute left-1 right-1 rounded-md overflow-hidden cursor-pointer border shadow-sm transition-shadow hover:shadow"
				:class="[block.bgClass, selectedCode === block.appointment.code ? 'ring-2 ring-primary border-primary' : 'border-gray-200 dark:border-gray-600']"
				:style="{
					top: `${block.topPx}px`,
					height: `${block.heightPx}px`,
					minHeight: block.heightPx < 24 ? '24px' : undefined,
				}"
				@click="$emit('select', block.appointment)"
			>
				<div class="p-1.5 h-full overflow-hidden flex flex-col gap-0.5">
					<div class="flex items-center justify-between gap-1 min-w-0">
						<span class="text-xs font-semibold truncate">{{ formatAppointmentCode(block.appointment.code) }}</span>
						<UBadge :color="block.statusColor" variant="subtle" size="xs" class="shrink-0">
							{{ block.appointment.status.toUpperCase() }}
						</UBadge>
					</div>
					<span class="text-[10px] sm:text-xs opacity-90 truncate">{{ block.timeText }}</span>
					<span class="text-[10px] sm:text-xs opacity-80 truncate">{{ block.appointment.customer_name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { useCalendarTimeSlots } from '~/composables/useCalendarTimeSlots';
import type { Appointment } from '~/utils/types/appointment';

const props = withDefaults(
	defineProps<{
		date: Date;
		appointments: Appointment[];
		selectedCode?: string | null;
		startHour?: number;
		endHour?: number;
		slotHeightPx?: number;
		getStatusColor?: (status: string) => string;
	}>(),
	{
		startHour: 6,
		endHour: 22,
		slotHeightPx: 24,
		getStatusColor: () => 'primary',
	},
);

defineEmits<{
	select: [appointment: Appointment];
}>();

const { totalSlots, totalHeightPx, slotHeightPx } = useCalendarTimeSlots(() => ({
	startHour: props.startHour,
	endHour: props.endHour,
	slotHeightPx: props.slotHeightPx,
}));

/** Display code as first 3 + .... + last 4 (after stripping APPT prefix). */
function formatAppointmentCode(code: string): string {
	const s = code.replace(/^APPT/i, '').trim();
	if (s.length >= 7) return `${s.slice(0, 3)}....${s.slice(-4)}`;
	return s || code;
}

const dayStart = computed(() => {
	const d = new Date(props.date);
	d.setHours(props.startHour, 0, 0, 0);
	return d.getTime();
});
const dayEnd = computed(() => {
	const d = new Date(props.date);
	d.setHours(props.endHour, 0, 0, 0);
	return d.getTime();
});

const positionedBlocks = computed(() => {
	const dayStartMs = dayStart.value;
	const dayEndMs = dayEnd.value;
	const rangeMs = dayEndMs - dayStartMs;

	return props.appointments
		.map((appointment) => {
			const start = new Date(appointment.start_date_time).getTime();
			const end = new Date(appointment.end_date_time).getTime();
			if (end <= dayStartMs || start >= dayEndMs) return null;
			const clipStart = Math.max(start, dayStartMs);
			const clipEnd = Math.min(end, dayEndMs);
			const topPx = ((clipStart - dayStartMs) / rangeMs) * totalHeightPx.value;
			const heightPx = Math.max(4, ((clipEnd - clipStart) / rangeMs) * totalHeightPx.value);

			const statusColor = props.getStatusColor(appointment.status);
			const bgClassMap: Record<string, string> = {
				primary: 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200',
				success: 'bg-success-100 dark:bg-success-900/40 text-success-800 dark:text-success-200',
				warning: 'bg-warning-100 dark:bg-warning-900/40 text-warning-800 dark:text-warning-200',
				error: 'bg-error-100 dark:bg-error-900/40 text-error-800 dark:text-error-200',
				info: 'bg-info-100 dark:bg-info-900/40 text-info-800 dark:text-info-200',
				neutral: 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200',
			};
			const timeText = `${format(new Date(clipStart), 'h:mm a')} – ${format(new Date(clipEnd), 'h:mm a')}`;

			return {
				appointment,
				topPx,
				heightPx,
				timeText,
				bgClass: bgClassMap[statusColor] ?? bgClassMap.primary,
				statusColor: (statusColor as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral') ?? 'primary',
			};
		})
		.filter((b): b is NonNullable<typeof b> => b !== null);
});
</script>
