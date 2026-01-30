<template>
	<div class="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-default">
		<!-- Time axis -->
		<div class="shrink-0 w-14 sm:w-16 py-2 text-right text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
			<div v-for="hour in hourLabels" :key="hour.value" class="h-12 leading-4 pr-2 -mt-2" :style="{ height: `${slotHeightPx}px` }">
				{{ hour.label }}
			</div>
		</div>
		<!-- Day column with time grid -->
		<div class="flex-1 min-w-0 relative">
			<!-- Grid lines (hour slots) -->
			<div class="absolute inset-0 flex flex-col">
				<div
					v-for="h in totalSlots"
					:key="h"
					class="border-b border-gray-100 dark:border-gray-800"
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
						<span class="text-xs font-semibold truncate">{{ block.appointment.order_no }}</span>
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
		slotHeightPx: 48,
		getStatusColor: () => 'primary',
	},
);

defineEmits<{
	select: [appointment: Appointment];
}>();

const totalSlots = computed(() => Math.max(0, props.endHour - props.startHour));
const totalHeightPx = computed(() => totalSlots.value * props.slotHeightPx);
const minutesInRange = computed(() => totalSlots.value * 60);

const hourLabels = computed(() => {
	const labels: { value: number; label: string }[] = [];
	for (let h = props.startHour; h < props.endHour; h++) {
		labels.push({
			value: h,
			label: h === 0 ? '12 AM' : h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h - 12} PM`,
		});
	}
	return labels;
});

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
