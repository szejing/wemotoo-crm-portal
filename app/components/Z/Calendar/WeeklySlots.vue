<template>
	<div class="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-default">
		<!-- Day headers: first column width matches time axis (w-14 sm:w-16) -->
		<div
			class="grid shrink-0 border-b border-gray-200 dark:border-gray-700 grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] sm:grid-cols-[4rem_repeat(7,minmax(0,1fr))]"
		>
			<div class="py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 min-w-0"></div>
			<div
				v-for="day in weekDays"
				:key="dayKey(day)"
				class="py-2 px-1 text-center text-xs font-medium border-r border-gray-200 dark:border-gray-700 last:border-r-0"
				:class="isToday(day) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'"
			>
				<div>{{ format(day, 'EEE') }}</div>
				<div class="text-lg font-semibold">{{ format(day, 'd') }}</div>
			</div>
		</div>
		<!-- Time grid: 30-min rows, time axis + 7 day columns (no padding so lines align) -->
		<div class="flex flex-1 min-h-0 overflow-auto items-stretch">
			<ZCalendarTimeAxis
				:start-hour="startHour"
				:end-hour="endHour"
				:slot-height-px="slotHeightPx"
			/>
			<!-- 7 day columns with appointment blocks -->
			<div class="flex-1 grid min-w-0 min-h-0" :style="{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', minHeight: `${totalHeightPx}px` }">
				<div
					v-for="(day, dayIndex) in weekDays"
					:key="dayKey(day)"
					class="relative border-r border-gray-100 dark:border-gray-800 last:border-r-0"
					:style="{ minHeight: `${totalHeightPx}px` }"
				>
					<!-- Grid lines: hour = stronger solid, 30-min = dotted -->
					<template v-for="h in totalSlots" :key="h">
						<div
							:class="[
								'absolute left-0 right-0',
								(h - 1) % 2 === 0
									? 'border-b-2 border-gray-200 dark:border-gray-600'
									: 'border-b border-dotted border-gray-100 dark:border-gray-800',
							]"
							:style="{
								top: `${(h - 1) * slotHeightPx}px`,
								height: `${slotHeightPx}px`,
							}"
						/>
					</template>
					<!-- Appointments for this day -->
					<div
						v-for="block in blocksByDay.get(dayIndex) ?? []"
						:key="block.appointment.code"
						class="absolute left-0.5 right-0.5 rounded-md overflow-hidden cursor-pointer border shadow-sm transition-shadow hover:shadow text-[10px] sm:text-xs"
						:class="[block.bgClass, selectedCode === block.appointment.code ? 'ring-2 ring-primary border-primary' : 'border-gray-200 dark:border-gray-600']"
						:style="{
							top: `${block.topPx}px`,
							height: `${block.heightPx}px`,
							minHeight: block.heightPx < 20 ? '20px' : undefined,
						}"
						@click="$emit('select', block.appointment)"
					>
						<div class="p-1 h-full overflow-hidden flex flex-col gap-0.5">
							<div class="flex items-center justify-between gap-1 min-w-0">
								<span class="font-semibold truncate">{{ block.appointment.order_no }}</span>
								<UBadge
									:color="block.statusColor as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'"
									variant="subtle"
									size="xs"
									class="shrink-0"
								>
									{{ block.appointment.status.toUpperCase() }}
								</UBadge>
							</div>
							<span class="opacity-90 truncate">{{ block.timeText }}</span>
							<span class="opacity-80 truncate">{{ block.appointment.customer_name }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { add, format, startOfDay, startOfWeek } from 'date-fns';
import { useCalendarTimeSlots } from '~/composables/useCalendarTimeSlots';
import type { Appointment } from '~/utils/types/appointment';

const props = withDefaults(
	defineProps<{
		weekStart: Date;
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

const weekStartsOn = 1;
const weekDays = computed(() => {
	const start = startOfWeek(props.weekStart, { weekStartsOn });
	return Array.from({ length: 7 }, (_, i) => add(start, { days: i }));
});

const dayKey = (d: Date) => format(d, 'yyyy-MM-dd');
const isToday = (d: Date) => dayKey(d) === dayKey(new Date());

const bgClassMap: Record<string, string> = {
	primary: 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200',
	success: 'bg-success-100 dark:bg-success-900/40 text-success-800 dark:text-success-200',
	warning: 'bg-warning-100 dark:bg-warning-900/40 text-warning-800 dark:text-warning-200',
	error: 'bg-error-100 dark:bg-error-900/40 text-error-800 dark:text-error-200',
	info: 'bg-info-100 dark:bg-info-900/40 text-info-800 dark:text-info-200',
	neutral: 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200',
};

const blocksByDay = computed(() => {
	const map = new Map<number, { appointment: Appointment; topPx: number; heightPx: number; timeText: string; bgClass: string; statusColor: string }[]>();
	for (let i = 0; i < 7; i++) map.set(i, []);

	const dayStarts = weekDays.value.map((d) => startOfDay(d).getTime());
	const dayEnds = dayStarts.map((_, i) => (dayStarts[i] ?? 0) + 24 * 60 * 60 * 1000);
	const rangeMs = (props.endHour - props.startHour) * 60 * 60 * 1000;

	for (const appointment of props.appointments) {
		const start = new Date(appointment.start_date_time).getTime();
		const end = new Date(appointment.end_date_time).getTime();

		for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
			const dayStartMs = dayStarts[dayIndex] ?? 0 + props.startHour * 60 * 60 * 1000;
			const dayEndMs = dayStarts[dayIndex] ?? 0 + props.endHour * 60 * 60 * 1000;
			if (end <= dayStartMs || start >= dayEndMs) continue;

			const clipStart = Math.max(start, dayStartMs);
			const clipEnd = Math.min(end, dayEndMs);
			const topPx = ((clipStart - dayStartMs) / rangeMs) * totalHeightPx.value;
			const heightPx = Math.max(4, ((clipEnd - clipStart) / rangeMs) * totalHeightPx.value);
			const timeText = `${format(clipStart, 'h:mm a')} – ${format(clipEnd, 'h:mm a')}`;
			const statusColor = props.getStatusColor(appointment.status);
			const bgClass = bgClassMap[statusColor] ?? bgClassMap.primary;
			const statusColorBadge = (statusColor as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral') ?? 'primary';
			map.get(dayIndex)!.push({ appointment, topPx, heightPx, timeText, bgClass: bgClass!, statusColor: statusColorBadge });
		}
	}
	return map;
});
</script>
