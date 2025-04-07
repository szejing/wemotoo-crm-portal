<template>
	<VueDatePicker v-model="currentDate" :placeholder="placeholder" :enable-time-picker="false" :auto-apply="true" :max-date="maxDate" :min-date="minDate" />
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

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
