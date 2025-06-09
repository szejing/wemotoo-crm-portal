<template>
	<UFormGroup name="date" class="mt-2 w-[150px] max-w-[250px]">
		<USelectMenu v-model="date" :options="date_range" size="md" option-attribute="name">
			<template #label>
				<span class="truncate text-sm font-bold text-neutral">{{ date?.name }}</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import { isSameDate } from 'wemotoo-common';

const today = new Date();
today.setHours(0, 0, 0, 0);

const thisMonth = new Date();
thisMonth.setDate(1);

const last7Days = new Date(today);
last7Days.setDate(today.getDate() - 7);

const last30Days = new Date(today);
last30Days.setDate(today.getDate() - 30);

const last60Days = new Date(today);
last60Days.setDate(today.getDate() - 60);

const lastMonth = new Date(today);
lastMonth.setMonth(today.getMonth() - 1);
lastMonth.setDate(1);

const date_range = [
	{ seq: 1, name: 'Last 7 Days', start_date: last7Days, end_date: today },
	{ seq: 2, name: 'Last 30 Days', start_date: last30Days, end_date: today },
	{ seq: 3, name: 'Last 60 Days', start_date: last60Days, end_date: today },
	{ seq: 4, name: 'Last Month', start_date: lastMonth, end_date: thisMonth },
];

const props = defineProps<{ startDate: Date; endDate: Date }>();
const emit = defineEmits(['update:startDate', 'update:endDate']);

const date = computed({
	get() {
		const value = date_range.find((d) => isSameDate(d.start_date, props.startDate) && isSameDate(d.end_date, props.endDate));

		return value;
	},
	set(date_range) {
		emit('update:startDate', date_range?.start_date);
		emit('update:endDate', date_range?.end_date);
	},
});
</script>

<style scoped lang="postcss"></style>
