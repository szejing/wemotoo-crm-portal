<template>
	<div class="flex flex-wrap items-center gap-2">
		<!-- Quick preset buttons -->
		<UButton
			v-for="preset in presets"
			:key="preset.key"
			:label="$t(`components.dateRange.${preset.key}`)"
			color="primary"
			:variant="isPresetActive(preset) ? 'solid' : 'soft'"
			size="xs"
			@click="applyPreset(preset)"
		/>
		<!-- Date range display + calendar popover -->
		<UPopover v-model:open="popoverOpen" :content="{ align: 'end' }" :modal="true">
			<UButton icon="i-lucide-calendar" color="neutral" variant="outline" class="min-w-56 justify-between group">
				<span class="truncate">
					{{ rangeLabel }}
				</span>
				<UIcon name="i-lucide-chevron-down" class="shrink-0 size-5 text-dimmed group-data-[state=open]:rotate-180 transition-transform" />
			</UButton>
			<template #content>
				<div class="p-2">
					<UCalendar v-model="draftCalendarRangeComputed" class="p-2" :number-of-months="2" range />
					<div class="flex justify-end gap-2 pt-2 border-t border-default mt-2">
						<UButton :label="$t('common.cancel')" color="neutral" variant="ghost" @click="popoverOpen = false" />
						<UButton :label="$t('common.apply')" color="primary" @click="applyCalendar" />
					</div>
				</div>
			</template>
		</UPopover>
	</div>
</template>

<script setup lang="ts">
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks } from 'date-fns';
import { getFormattedDate } from 'wemotoo-common';
import type { Range } from '~/utils/interface';

const model = defineModel<Range>({ required: true });

const { t } = useI18n();

const presets = [
	{ key: 'today', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }) },
	{
		key: 'yesterday',
		getRange: () => {
			const d = new Date();
			d.setDate(d.getDate() - 1);
			return { start: startOfDay(d), end: endOfDay(d) };
		},
	},
	{
		key: 'tomorrow',
		getRange: () => {
			const d = new Date();
			d.setDate(d.getDate() + 1);
			return { start: startOfDay(d), end: endOfDay(d) };
		},
	},
	{
		key: 'thisWeek',
		getRange: () => ({
			start: startOfWeek(new Date(), { weekStartsOn: 1 }),
			end: endOfWeek(new Date(), { weekStartsOn: 1 }),
		}),
	},
	{
		key: 'lastWeek',
		getRange: () => {
			const now = new Date();
			const lastWeek = subWeeks(now, 1);
			return {
				start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
				end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
			};
		},
	},
	{
		key: 'thisMonth',
		getRange: () => ({
			start: startOfMonth(new Date()),
			end: endOfMonth(new Date()),
		}),
	},
	{
		key: 'thisYear',
		getRange: () => ({
			start: startOfYear(new Date()),
			end: endOfYear(new Date()),
		}),
	},
];

const rangeLabel = computed(() => {
	const { start, end } = model.value;
	if (!start || !end) return t('components.filter.selectDateRange');
	return `${getFormattedDate(start, 'dd-MM-yyyy')} - ${getFormattedDate(end, 'dd-MM-yyyy')}`;
});

const toCalendarDate = (date: Date) => new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

const popoverOpen = ref(false);

// Draft range (Date) for calendar popover; only committed to model on Apply
const draftRange = ref<Range>({ start: undefined, end: undefined });

watch(popoverOpen, (open) => {
	if (open && model.value?.start && model.value?.end) {
		draftRange.value = {
			start: model.value.start,
			end: model.value.end,
		};
	}
});

// Bridge for UCalendar: computed converts between our Range (Date) and CalendarDate range
const draftCalendarRangeComputed = computed({
	get: () => ({
		start: draftRange.value?.start ? toCalendarDate(draftRange.value.start) : undefined,
		end: draftRange.value?.end ? toCalendarDate(draftRange.value.end) : undefined,
	}),
	set: (val: { start?: CalendarDate; end?: CalendarDate } | null) => {
		if (!val?.start) return;
		draftRange.value = {
			start: val.start.toDate(getLocalTimeZone()),
			end: val.end ? val.end.toDate(getLocalTimeZone()) : val.start.toDate(getLocalTimeZone()),
		};
	},
});

function isPresetActive(preset: (typeof presets)[0]) {
	const r = model.value;
	if (!r?.start || !r?.end) return false;
	const presetRange = preset.getRange();
	return r.start.getTime() === presetRange.start.getTime() && r.end.getTime() === presetRange.end.getTime();
}

function applyPreset(preset: (typeof presets)[0]) {
	model.value = preset.getRange();
}

function applyCalendar() {
	if (draftRange.value?.start && draftRange.value?.end) {
		model.value = { start: draftRange.value.start, end: draftRange.value.end };
	}
	popoverOpen.value = false;
}
</script>
