<template>
	<UFormGroup name="duration" class="mt-2">
		<USelectMenu v-model="duration" :options="duration_options" size="md">
			<template #label>
				<span v-if="duration" class="truncate">{{ duration }}</span>
				<span v-else class="text-gray-400">Duration (30m)</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const duration_options = ['30m', '1h', '1h30m', '2h', '2h30m', '3h', '3h30m'];

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

<style scoped lang="postcss"></style>
