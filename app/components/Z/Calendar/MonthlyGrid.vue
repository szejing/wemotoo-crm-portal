<template>
	<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-default">
		<!-- Weekday headers -->
		<div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
			<div v-for="wd in weekdayLabels" :key="wd" class="py-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
				{{ wd }}
			</div>
		</div>
		<!-- Month grid: 6 rows × 7 days -->
		<div class="grid grid-cols-7 auto-rows-fr" :style="{ gridTemplateRows: `repeat(${weeksInGrid}, minmax(100px, 1fr))` }">
			<div
				v-for="cell in gridCells"
				:key="cell.key"
				class="min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800 last:border-r-0 flex flex-col transition-colors"
				:class="[
					cell.isCurrentMonth ? 'bg-default' : 'bg-gray-50/80 dark:bg-gray-900/50',
					cell.isToday ? 'ring-2 ring-primary ring-inset' : '',
					cell.isSelected ? 'ring-2 ring-primary ring-inset bg-primary/5 dark:bg-primary/10' : '',
					!(cell.isToday || cell.isSelected) && 'overflow-hidden',
				]"
			>
				<!-- Date number -->
				<div class="shrink-0 flex items-center justify-between px-2 py-1">
					<UButton
						v-if="cell.date"
						:color="cell.isSelected ? 'primary' : cell.isToday ? 'primary' : 'neutral'"
						:variant="cell.isSelected || cell.isToday ? 'solid' : 'ghost'"
						size="xs"
						class="w-7 h-7 min-w-7 rounded-full p-0 text-sm font-medium"
						:class="!cell.isCurrentMonth && 'text-gray-400 dark:text-gray-500'"
						@click="$emit('selectDay', cell.date)"
					>
						{{ cell.dayNumber ?? '' }}
					</UButton>
					<span v-else class="w-7 h-7 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
						{{ cell.dayNumber ?? '' }}
					</span>
				</div>
				<!-- Appointments in this day (UChip / UBadge) -->
				<div class="flex-1 overflow-y-auto px-1.5 pb-1.5 space-y-1">
					<UButton
						v-for="appointment in cell.appointments"
						:key="appointment.code"
						block
						variant="soft"
						:color="(getStatusColor(appointment.status) as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral') ?? 'primary'"
						size="xs"
						class="justify-start h-auto py-1.5 px-2 text-xs cursor-pointer"
						:class="selectedCode === appointment.code ? 'ring-2 ring-primary ring-inset' : ''"
						@click.stop="$emit('selectAppointment', appointment)"
					>
						<div class="w-full text-left truncate space-y-0.5">
							<div class="flex items-center justify-between gap-1 min-w-0">
								<span class="font-medium truncate">{{ appointment.order_no }}</span>
								<UBadge
									:color="(getStatusColor(appointment.status) as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral') ?? 'neutral'"
									variant="subtle"
									size="xs"
									class="shrink-0"
								>
									{{ appointment.status.toUpperCase() }}
								</UBadge>
							</div>
							<span class="block text-[10px] opacity-90 truncate">{{ formatTime(appointment.start_date_time) }} · {{ appointment.customer_name }}</span>
						</div>
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { add, endOfMonth, format, startOfMonth, startOfWeek } from 'date-fns';
import type { Appointment } from '~/utils/types/appointment';

const props = withDefaults(
	defineProps<{
		month: Date;
		appointments: Appointment[];
		selectedCode?: string | null;
		selectedDay?: Date | null;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		getStatusColor?: (status: string) => string;
	}>(),
	{
		weekStartsOn: 1,
		selectedDay: null,
		getStatusColor: () => 'primary',
	},
);

defineEmits<{
	selectDay: [date: Date];
	selectAppointment: [appointment: Appointment];
}>();

// Weekday headers: Monday first when weekStartsOn is 1
const weekdayLabels = computed(() => {
	const monday = new Date(2024, 0, 1); // Jan 1 2024 is Monday
	const labels: string[] = [];
	for (let i = 0; i < 7; i++) {
		labels.push(format(add(monday, { days: i }), 'EEE'));
	}
	return labels;
});

const weeksInGrid = 6;

const dayKey = (d: Date) => format(d, 'yyyy-MM-dd');
const todayKey = dayKey(new Date());

const appointmentsByDate = computed(() => {
	const map: Record<string, Appointment[]> = {};
	for (const a of props.appointments) {
		const key = dayKey(new Date(a.start_date_time));
		if (!map[key]) map[key] = [];
		map[key].push(a);
	}
	for (const key of Object.keys(map)) {
		const arr = map[key];
		if (arr) arr.sort((x, y) => new Date(x.start_date_time).getTime() - new Date(y.start_date_time).getTime());
	}
	return map;
});

const gridCells = computed(() => {
	const first = startOfMonth(props.month);
	const last = endOfMonth(props.month);
	const gridStart = startOfWeek(first, { weekStartsOn: props.weekStartsOn });
	const selectedKey = props.selectedDay ? dayKey(props.selectedDay) : null;
	const cells: {
		key: string;
		date: Date | null;
		dayNumber: number | null;
		isCurrentMonth: boolean;
		isToday: boolean;
		isSelected: boolean;
		appointments: Appointment[];
	}[] = [];
	let cursor = new Date(gridStart);
	const totalCells = 7 * weeksInGrid;
	for (let i = 0; i < totalCells; i++) {
		const key = dayKey(cursor);
		const isCurrentMonth = cursor.getMonth() === props.month.getMonth();
		const isToday = key === todayKey;
		const isSelected = selectedKey === key;
		const appointments = isCurrentMonth ? (appointmentsByDate.value[key] ?? []) : [];
		cells.push({
			key: `${key}-${i}`,
			date: new Date(cursor),
			dayNumber: cursor.getDate(),
			isCurrentMonth,
			isToday,
			isSelected,
			appointments,
		});
		cursor = add(cursor, { days: 1 });
	}
	return cells;
});

const formatTime = (d: string | Date) => format(new Date(d), 'h:mm a');

const getStatusColor = (status: string) => props.getStatusColor(status);
</script>
