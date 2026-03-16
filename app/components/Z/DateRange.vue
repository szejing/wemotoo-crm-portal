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
		<!-- Date range display + calendar popover (custom range or single date) -->
		<UPopover v-model:open="popoverOpen" :content="{ align: 'end' }" :modal="true">
			<UButton icon="i-lucide-calendar" color="neutral" variant="outline" class="min-w-56 justify-between group">
				<span class="truncate">
					{{ rangeLabel }}
				</span>
				<UIcon name="i-lucide-chevron-down" class="shrink-0 size-5 text-dimmed group-data-[state=open]:rotate-180 transition-transform" />
			</UButton>
			<template #content>
				<div class="p-2">
					<ZDateRangePicker
						:model-value="draftForPicker"
						@update:model-value="onDraftUpdate"
						@close="applyCalendar"
					/>
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
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks } from 'date-fns';
import { getFormattedDate } from 'wemotoo-common';
import type { Range } from '~/utils/interface';
import type { DateRange as PickerDateRange } from '~/components/Z/DateRangePicker.vue';

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
	if (!start) return t('components.filter.selectDateRange');
	// Single date: only start, or start and end on same day
	if (!end || (start.getTime() === end.getTime())) {
		return getFormattedDate(start, 'dd-MM-yyyy');
	}
	return `${getFormattedDate(start, 'dd-MM-yyyy')} - ${getFormattedDate(end, 'dd-MM-yyyy')}`;
});

const popoverOpen = ref(false);

// Draft range for calendar popover; only committed to model on Apply or when picker emits close
const draftRange = ref<Range>({ start: undefined, end: undefined });

watch(popoverOpen, (open) => {
	if (open) {
		draftRange.value = {
			start: model.value?.start,
			end: model.value?.end,
		};
	}
});

// Adapter for ZDateRangePicker (expects start/end as Date | null)
const draftForPicker = computed<PickerDateRange | null>(() => ({
	start: draftRange.value?.start ?? null,
	end: draftRange.value?.end ?? null,
}));

function onDraftUpdate(v: PickerDateRange | null) {
	if (!v) {
		draftRange.value = { start: undefined, end: undefined };
		return;
	}
	draftRange.value = {
		start: v.start ?? undefined,
		end: v.end ?? undefined,
	};
}

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
	const { start, end } = draftRange.value ?? {};
	// Commit single date (start only) or range (start + end; end defaults to start when missing)
	if (start) {
		model.value = { start, end: end ?? start };
	}
	popoverOpen.value = false;
}
</script>
