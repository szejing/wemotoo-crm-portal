<template>
	<UPopover :popper="{ placement: 'bottom-start' }">
		<UButton icon="i-heroicons-calendar-days-20-solid" :label="currentDate ? format(currentDate, 'dd/MM/yyyy') : placeholder" variant="outline" />

		<template #panel="{ close }">
			<ZDatePicker v-model="currentDate" is-required :min-date="minDate" :max-date="maxDate" @close="close" />
		</template>
	</UPopover>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';

const props = defineProps<{ date: Date | undefined; placeholder: string; minDate?: Date }>();

const maxDate = new Date();

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
