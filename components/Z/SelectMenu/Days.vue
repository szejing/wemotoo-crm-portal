<template>
	<UFormField name="days" class="mt-2">
		<USelectMenu v-model="days" :items="daysItems" size="md" multiple value-key="short">
			<template #default>
				<span v-if="days.length > 0" class="truncate">{{ days?.map((day) => days_options.find((d) => d.short === day)?.short).join(', ') }}</span>
				<span v-else class="text-neutral-400">Mon, Tue, Wed...</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
const days_options = [
	{ seq: 1, short: 'Mon', long: 'Monday' },
	{ seq: 2, short: 'Tue', long: 'Tuesday' },
	{ seq: 3, short: 'Wed', long: 'Wednesday' },
	{ seq: 4, short: 'Thu', long: 'Thursday' },
	{ seq: 5, short: 'Fri', long: 'Friday' },
	{ seq: 6, short: 'Sat', long: 'Saturday' },
	{ seq: 7, short: 'Sun', long: 'Sunday' },
];

const daysItems = computed(() => {
	return days_options.map((day) => ({
		...day,
		label: day.long,
	}));
});

const props = defineProps<{ days: string[] | null }>();

const emit = defineEmits(['update:days']);

const days = computed({
	get() {
		return (
			props.days?.toSorted((a, b) => {
				const aSeq = days_options.find((d) => d.short === a)?.seq ?? 0;
				const bSeq = days_options.find((d) => d.short === b)?.seq ?? 0;
				return aSeq - bSeq;
			}) ?? []
		);
	},
	set(days) {
		emit('update:days', days);
	},
});
</script>

<style scoped></style>
