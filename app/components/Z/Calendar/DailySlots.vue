<template>
	<div
		ref="scrollContainer"
		class="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-default items-stretch max-h-[calc(100vh-320px)] overflow-y-auto relative"
	>
		<ZCalendarTimeAxis :start-hour="startHour" :end-hour="endHour" :slot-height-px="slotHeightPx" />
		<!-- Day column with time grid: hour = stronger solid, 30-min = dotted -->
		<div class="flex-1 min-w-0 relative" :style="{ minHeight: `${totalHeightPx}px` }">
			<!-- Time grid: full-width rows so each time slot (e.g. 12 PM) is a clean horizontal row -->
			<div class="absolute inset-0 flex flex-col pointer-events-none z-0" aria-hidden="true">
				<div
					v-for="h in totalSlots"
					:key="h"
					:class="[
						'shrink-0 w-full box-border',
						(h - 1) % 2 === 0 ? 'border-b-2 border-gray-200 dark:border-gray-600' : 'border-b border-dotted border-gray-100 dark:border-gray-800',
					]"
					:style="{ height: `${slotHeightPx}px`, minHeight: `${slotHeightPx}px` }"
				/>
			</div>

			<!-- Current-time indicator (red line) -->
			<div
				v-if="isDateToday && nowLinePx !== null"
				class="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
				:style="{ top: `${nowLinePx}px` }"
			>
				<div class="w-2.5 h-2.5 rounded-full bg-red-500 dark:bg-red-400 -ml-1 shrink-0" />
				<div class="flex-1 h-0.5 bg-red-500 dark:bg-red-400" />
			</div>

			<!-- Appointments positioned by time -->
			<div
				v-for="block in positionedBlocks"
				:key="block.appointment.code"
				class="absolute left-1 right-1 rounded-md overflow-hidden cursor-pointer border shadow-sm transition-all hover:shadow-md z-10"
				:class="[block.bgClass, selectedCode === block.appointment.code ? 'ring-2 ring-primary border-primary' : 'border-gray-200 dark:border-gray-600']"
				:style="{
					top: `${block.topPx}px`,
					height: `${block.heightPx}px`,
					minHeight: block.heightPx < 24 ? '24px' : undefined,
				}"
				@click="$emit('select', block.appointment)"
			>
				<div class="p-1.5 sm:p-2 h-full min-h-0 overflow-y-auto flex flex-col gap-0.5">
					<div class="flex items-center justify-between gap-1 min-w-0 shrink-0">
						<span class="text-xs sm:text-sm font-semibold truncate">{{ block.appointment.customer_name }}</span>
						<UBadge :color="block.statusColor" variant="subtle" size="xs" class="shrink-0">
							{{ $t('options.' + block.appointment.status.toLowerCase()) }}
						</UBadge>
					</div>
					<div class="flex items-center gap-1.5 text-[10px] sm:text-xs opacity-90 shrink-0">
						<UIcon name="i-heroicons-clock" class="w-3 h-3 shrink-0" />
						<span class="truncate">{{ block.timeText }}</span>
					</div>
					<span v-if="block.appointment.appt_desc && block.heightPx > 48" class="text-[10px] sm:text-xs opacity-75 truncate shrink-0">
						{{ block.appointment.appt_desc }}
					</span>
				</div>
			</div>

			<!-- Empty state for no appointments -->
			<div v-if="positionedBlocks.length === 0" class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
				<div class="flex flex-col items-center gap-2 text-center p-6 bg-default/80 rounded-xl">
					<UIcon name="i-heroicons-calendar-days" class="w-10 h-10 text-gray-300 dark:text-gray-600" />
					<p class="text-sm text-gray-400 dark:text-gray-500 font-medium">{{ $t('pages.noAppointmentsFound') }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { format, isToday as isTodayFn } from 'date-fns';
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
		slotHeightPx: 32,
		getStatusColor: () => 'primary',
	},
);

defineEmits<{
	select: [appointment: Appointment];
}>();

const { t: $t } = useI18n();

const scrollContainer = ref<HTMLElement | null>(null);

const { totalSlots, totalHeightPx, slotHeightPx } = useCalendarTimeSlots(() => ({
	startHour: props.startHour,
	endHour: props.endHour,
	slotHeightPx: props.slotHeightPx,
}));

// Today check, current time indicator
const isDateToday = computed(() => isTodayFn(props.date));
const now = ref(new Date());
let timer: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
	timer = setInterval(() => {
		now.value = new Date();
	}, 60_000);
	// Auto-scroll to current time or first appointment
	nextTick(() => {
		scrollToRelevantTime();
	});
});
onUnmounted(() => {
	if (timer) clearInterval(timer);
});

const nowLinePx = computed(() => {
	if (!isDateToday.value) return null;
	const h = now.value.getHours();
	const m = now.value.getMinutes();
	if (h < props.startHour || h >= props.endHour) return null;
	const rangeMs = (props.endHour - props.startHour) * 60 * 60 * 1000;
	const offsetMs = (h - props.startHour) * 60 * 60 * 1000 + m * 60 * 1000;
	return (offsetMs / rangeMs) * totalHeightPx.value;
});

function scrollToRelevantTime() {
	const container = scrollContainer.value;
	if (!container) return;
	let scrollTo = 0;
	if (isDateToday.value && nowLinePx.value !== null) {
		scrollTo = nowLinePx.value - 100;
	} else if (positionedBlocks.value.length > 0) {
		scrollTo = (positionedBlocks.value[0]?.topPx ?? 0) - 50;
	} else {
		// Scroll to ~9 AM area
		const rangeMs = (props.endHour - props.startHour) * 60 * 60 * 1000;
		const nineAm = Math.max(0, (9 - props.startHour) * 60 * 60 * 1000);
		scrollTo = (nineAm / rangeMs) * totalHeightPx.value - 50;
	}
	container.scrollTo({ top: Math.max(0, scrollTo), behavior: 'smooth' });
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
