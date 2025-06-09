<template>
	<UPopover :popper="{ placement: 'bottom-start' }">
		<UButton icon="i-heroicons-calendar-days-20-solid" :label="currentDate ? getFormattedDate(currentDate, 'dd/MM/yyyy') : placeholder" variant="outline" />

		<template #panel="{ close }">
			<ZDatePicker v-model="currentDate" is-required :min-date="minDate" :max-date="maxDate" @close="close" />
		</template>
	</UPopover>
</template>

<script lang="ts" setup>
import { getFormattedDate } from 'wemotoo-common';

const props = defineProps<{ date: Date | undefined; placeholder: string; minDate?: Date; maxDate?: Date }>();

const maxDate = computed(() => {
	if (props.maxDate) {
		return props.maxDate;
	}

	return new Date();
});

const emit = defineEmits(['update:date']);

const currentDate = computed({
	get() {
		return props.date;
	},
	set(date) {
		emit('update:date', date);
	},
});
</script>

<style scoped lang="postcss"></style>
