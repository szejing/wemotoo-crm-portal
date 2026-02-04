<script setup lang="ts">
import { eachDayOfInterval } from 'date-fns';
import type { Period } from '~/utils/types/period';
import type { Range } from '~/utils/interface';

const model = defineModel<Period>({ required: true });

const props = defineProps<{ range: Range }>();

const { t } = useI18n();

const days = computed(() => {
	const { start, end } = props.range;
	if (!start || !end) return [];
	return eachDayOfInterval({ start, end });
});

const periodValues = computed<Period[]>(() => {
	if (days.value.length <= 8) {
		return ['daily'];
	}

	if (days.value.length <= 31) {
		return ['daily', 'weekly'];
	}

	return ['weekly', 'monthly'];
});

const periods = computed(() =>
	periodValues.value.map((value) => ({
		value,
		label: t('components.filter.' + value),
	})),
);

// Ensure the model value is always a valid period
watch(periodValues, () => {
	if (!periodValues.value.includes(model.value)) {
		model.value = periodValues.value[0]!;
	}
});
</script>

<template>
	<USelect
		v-model="model"
		:items="periods"
		value-attribute="value"
		variant="ghost"
		class="data-[state=open]:bg-elevated"
		:ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
	/>
</template>
