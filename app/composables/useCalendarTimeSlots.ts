/**
 * Shared calendar time-slot logic: 30 minutes per row.
 * Used by DailySlots and WeeklySlots for consistent grid and time axis.
 */
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

export const SLOTS_PER_HOUR = 2;

export interface UseCalendarTimeSlotsOptions {
	startHour: number;
	endHour: number;
	slotHeightPx: number;
}

export interface CalendarSlotRow {
	label: string;
}

export function useCalendarTimeSlots(options: MaybeRefOrGetter<UseCalendarTimeSlotsOptions>) {
	const opts = computed(() => toValue(options));

	const totalSlots = computed(
		() => Math.max(0, (opts.value.endHour - opts.value.startHour) * SLOTS_PER_HOUR),
	);
	const totalHeightPx = computed(() => totalSlots.value * opts.value.slotHeightPx);

	/** One entry per 30-min row; hour label on first slot of each hour, empty for :30 slots */
	const slotRows = computed<CalendarSlotRow[]>(() => {
		const rows: CalendarSlotRow[] = [];
		const { startHour } = opts.value;
		for (let i = 0; i < totalSlots.value; i++) {
			const isHourStart = i % SLOTS_PER_HOUR === 0;
			const hour = startHour + Math.floor(i / SLOTS_PER_HOUR);
			const label = isHourStart
				? hour === 0
					? '12 AM'
					: hour === 12
						? '12 PM'
						: hour < 12
							? `${hour} AM`
							: `${hour - 12} PM`
				: '';
			rows.push({ label });
		}
		return rows;
	});

	return {
		SLOTS_PER_HOUR,
		totalSlots,
		totalHeightPx,
		slotHeightPx: computed(() => opts.value.slotHeightPx),
		slotRows,
		/** Range in ms for block positioning (startHour to endHour) */
		rangeMs: computed(() => (opts.value.endHour - opts.value.startHour) * 60 * 60 * 1000),
	};
}
