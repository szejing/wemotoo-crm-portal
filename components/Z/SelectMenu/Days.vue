<template>
	<UFormGroup name="days" class="mt-2">
		<USelectMenu v-model="days" :options="days_options" size="md" multiple>
			<template #label>
				<span v-if="days.length" class="truncate">{{ days.map((day) => day.toUpperCase()).join(', ') }}</span>
				<span v-else class="text-gray-400">Monday, Tuesday...</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const days_options = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const props = defineProps<{ days: string[] | null }>();

const emit = defineEmits(['update:days']);

const days = computed({
	get() {
		return props.days ?? [];
	},
	set(days) {
		emit('update:days', [...days]);
	},
});
</script>

<style scoped lang="postcss"></style>
