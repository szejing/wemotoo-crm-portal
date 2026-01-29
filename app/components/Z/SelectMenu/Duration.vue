<template>
	<USelectMenu v-model="duration" :items="items" value-key="label" size="md" label-key="label" description-key="label" placeholder="Select Duration" />
</template>

<script lang="ts" setup>
const duration_options = ['30m', '1h', '1h30m', '2h', '2h30m', '3h', '3h30m'];

const items = computed(() => {
	return duration_options.map((duration) => ({ label: duration }));
});

const props = defineProps<{ duration: string | null }>();

const emit = defineEmits(['update:duration']);

const duration = computed({
	get() {
		return props.duration ?? '';
	},
	set(duration) {
		emit('update:duration', duration);
	},
});
</script>

<style scoped></style>
