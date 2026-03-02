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
				class="py-2 px-1 text-center text-xs font-medium border-r border-gray-200 dark:border-gray-700 last:border-r-0 transition-colors"
				:class="[isToday(day) ? 'text-primary-600 dark:text-primary-400 bg-primary-50/60 dark:bg-primary-950/30' : 'text-gray-700 dark:text-gray-300']"
			>
				<div>{{ format(day, 'EEE') }}</div>
				<div class="text-lg font-semibold">{{ format(day, 'd') }}</div>
			</div>
		</div>
		<!-- Time grid: 30-min rows, time axis + 7 day columns -->
		<div class="flex flex-1 min-h-0 overflow-auto items-stretch">
			<ZCalendarTimeAxis :start-hour="startHour" :end-hour="endHour" :slot-height-px="slotHeightPx" />
			<div class="flex-1 grid min-w-0 min-h-0" :style="{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', minHeight: `${totalHeightPx}px` }">
				<div
					v-for="(day, dayIndex) in weekDays"
					:key="dayKey(day)"
					class="relative border-r border-gray-100 dark:border-gray-800 last:border-r-0 min-h-0"
					:class="[isToday(day) ? 'bg-primary-50/40 dark:bg-primary-950/20' : '']"
					:style="{ minHeight: `${totalHeightPx}px` }"
				>
					<!-- Grid lines: full-hour = thicker, half-hour = dotted (background layer) -->
					<div class="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
						<template v-for="h in totalSlots" :key="h">
							<div
								:class="[
									'absolute left-0 right-0',
									(h - 1) % 2 === 0 ? 'border-b-2 border-gray-200 dark:border-gray-600' : 'border-b border-dotted border-gray-100/80 dark:border-gray-700/60',
								]"
								:style="{
									top: `${(h - 1) * slotHeightPx}px`,
									height: `${slotHeightPx}px`,
								}"
							/>
						</template>
					</div>
					<!-- Appointments layer (above grid) -->
					<div class="absolute inset-0 z-10 overflow-visible">
						<template v-for="block in blocksByDay.get(dayIndex) ?? []" :key="block.appointment.code">
							<UPopover :open="hoveredCode === block.appointment.code" :popper="{ placement: 'right', strategy: 'fixed' }">
								<div
									class="absolute rounded-md cursor-pointer transition-all overflow-hidden flex flex-col"
									:class="[
										'border-l-[5px] shadow-sm hover:shadow-md',
										block.borderClass,
										selectedCode === block.appointment.code
											? 'ring-2 ring-primary ring-inset border border-primary-300 dark:border-primary-600'
											: 'bg-elevated border border-gray-200 dark:border-gray-600',
									]"
									:style="{
										top: `${block.topPx}px`,
										left: `${block.leftPct}%`,
										width: `calc(${block.widthPct}% - 2px)`,
										marginLeft: '1px',
										height: `${block.heightPx}px`,
										minHeight: block.heightPx < 24 ? '24px' : undefined,
									}"
									@click="$emit('select', block.appointment)"
									@mouseenter="hoveredCode = block.appointment.code"
									@mouseleave="hoveredCode = null"
								>
									<div class="p-1.5 h-full overflow-hidden flex flex-col gap-0.5 min-w-0">
										<div class="flex items-start justify-between gap-1 min-w-0">
											<span class="font-semibold truncate text-gray-900 dark:text-gray-100">{{ formatAppointmentCode(block.appointment.code) }}</span>
											<UBadge
												:color="block.statusColor as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'"
												variant="subtle"
												size="xs"
												class="shrink-0"
											>
												{{ block.appointment.status }}
											</UBadge>
										</div>
										<span class="text-gray-600 dark:text-gray-400 truncate">{{ block.timeText }}</span>
										<span class="text-gray-500 dark:text-gray-500 truncate">{{ block.appointment.customer_name }}</span>
									</div>
								</div>
								<template #content>
									<div class="p-3 w-72 space-y-3" @mouseenter="hoveredCode = block.appointment.code" @mouseleave="hoveredCode = null">
										<div class="space-y-1.5">
											<div class="flex items-center justify-between gap-2">
												<span class="font-semibold text-gray-900 dark:text-white">{{ block.appointment.code }}</span>
												<UBadge :color="block.statusColor" variant="subtle" size="sm">
													{{ $t('options.' + block.appointment.status.toLowerCase()) }}
												</UBadge>
											</div>
											<p class="text-sm text-gray-600 dark:text-gray-400">{{ block.timeText }}</p>
											<p class="text-sm font-medium text-gray-900 dark:text-white">{{ block.appointment.customer_name }}</p>
											<p class="text-xs text-gray-500 dark:text-gray-500">{{ block.appointment.customer_phone }}</p>
											<p v-if="block.appointment.appt_desc" class="text-xs text-gray-600 dark:text-gray-400">
												{{ block.appointment.appt_desc }}
											</p>
											<p v-if="block.appointment.duration" class="text-xs text-gray-500">
												{{ $t('pages.durationMinutes', { n: block.appointment.duration }) }}
											</p>
										</div>
										<div class="flex gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
											<UButton size="xs" color="primary" variant="soft" :label="$t('components.calendar.view')" @click="$emit('select', block.appointment)" />
											<UButton size="xs" color="neutral" variant="outline" :label="$t('components.calendar.edit')" @click="$emit('edit', block.appointment)" />
										</div>
									</div>
								</template>
							</UPopover>
						</template>
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

export type CalendarBlock = {
	appointment: Appointment;
	topPx: number;
	heightPx: number;
	timeText: string;
	statusColor: string;
	borderClass: string;
	clipStartMs: number;
	clipEndMs: number;
	columnIndex: number;
	totalColumns: number;
	leftPct: number;
	widthPct: number;
};

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
	edit: [appointment: Appointment];
}>();

const hoveredCode = ref<string | null>(null);
const { t: $t } = useI18n();

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

function formatAppointmentCode(code: string): string {
	const s = code.replace(/^APPT/i, '').trim();
	if (s.length >= 7) return `${s.slice(0, 3)}....${s.slice(-4)}`;
	return s || code;
}

/** Left border accent by status (no full background). */
const borderClassMap: Record<string, string> = {
	primary: 'border-l-primary-500',
	success: 'border-l-success-500',
	warning: 'border-l-warning-500',
	error: 'border-l-error-500',
	info: 'border-l-info-500',
	neutral: 'border-l-gray-400 dark:border-l-gray-500',
};

/** Assign overlap columns: sort by start, assign column index so overlapping blocks get different columns. */
function assignOverlapColumns(blocks: { clipStartMs: number; clipEndMs: number }[]): { columnIndex: number; totalColumns: number }[] {
	if (blocks.length === 0) return [];
	const sorted = [...blocks].sort((a, b) => a.clipStartMs - b.clipStartMs);
	const columnIndex: number[] = [];
	let totalColumns = 1;
	for (let i = 0; i < sorted.length; i++) {
		let col = 0;
		while (col < totalColumns) {
			let conflict = false;
			for (let j = 0; j < i; j++) {
				if (columnIndex[j] === col && sorted[j].clipEndMs > sorted[i].clipStartMs && sorted[j].clipStartMs < sorted[i].clipEndMs) {
					conflict = true;
					break;
				}
			}
			if (!conflict) break;
			col++;
		}
		if (col >= totalColumns) totalColumns = col + 1;
		columnIndex.push(col);
	}
	return columnIndex.map((col) => ({ columnIndex: col, totalColumns }));
}

const blocksByDay = computed(() => {
	const map = new Map<number, CalendarBlock[]>();
	for (let i = 0; i < 7; i++) map.set(i, []);

	const dayStarts = weekDays.value.map((d) => startOfDay(d).getTime());
	const rangeMs = (props.endHour - props.startHour) * 60 * 60 * 1000;

	for (const appointment of props.appointments) {
		const start = new Date(appointment.start_date_time).getTime();
		const end = new Date(appointment.end_date_time).getTime();

		for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
			const dayBaseMs = dayStarts[dayIndex] ?? 0;
			const dayStartMs = dayBaseMs + props.startHour * 60 * 60 * 1000;
			const dayEndMs = dayBaseMs + props.endHour * 60 * 60 * 1000;
			if (end <= dayStartMs || start >= dayEndMs) continue;

			const clipStartMs = Math.max(start, dayStartMs);
			const clipEndMs = Math.min(end, dayEndMs);
			const topPx = ((clipStartMs - dayStartMs) / rangeMs) * totalHeightPx.value;
			const heightPx = Math.max(4, ((clipEndMs - clipStartMs) / rangeMs) * totalHeightPx.value);
			const timeText = `${format(clipStartMs, 'h:mm a')} – ${format(clipEndMs, 'h:mm a')}`;
			const statusColor = props.getStatusColor(appointment.status);
			const borderClass = borderClassMap[statusColor] ?? borderClassMap.primary;
			const statusColorBadge = (statusColor as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral') ?? 'primary';

			map.get(dayIndex)!.push({
				appointment,
				topPx,
				heightPx,
				timeText,
				statusColor: statusColorBadge,
				borderClass,
				clipStartMs,
				clipEndMs,
				columnIndex: 0,
				totalColumns: 1,
				leftPct: 0,
				widthPct: 100,
			});
		}
	}

	// Resolve overlap layout per day
	for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
		const blocks = map.get(dayIndex)!;
		if (blocks.length === 0) continue;
		const layout = assignOverlapColumns(blocks);
		for (let i = 0; i < blocks.length; i++) {
			const b = blocks[i];
			const l = layout[i];
			b.columnIndex = l.columnIndex;
			b.totalColumns = l.totalColumns;
			b.leftPct = (l.columnIndex / l.totalColumns) * 100;
			b.widthPct = 100 / l.totalColumns;
		}
	}

	return map;
});
</script>
