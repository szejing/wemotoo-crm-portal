<template>
	<UFormField name="time" class="mt-2">
		<USelectMenu v-model="time" :items="timeItems" value-key="label" size="md">
			<template #default>
				<span v-if="time" class="truncate">
					{{ props.type === 'start' ? 'Start : ' : 'End : ' }}
					{{ time }}
				</span>
				<span v-else class="text-neutral-400">{{ title }}</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
const time_options = [
	'12.00 am',
	'01.00 am',
	'02.00 am',
	'03.00 am',
	'04.00 am',
	'05.00 am',
	'06.00 am',
	'07.00 am',
	'08.00 am',
	'09.00 am',
	'10.00 am',
	'11.00 am',
	'12.00 pm',
	'01.00 pm',
	'02.00 pm',
	'03.00 pm',
	'04.00 pm',
	'05.00 pm',
	'06.00 pm',
	'07.00 pm',
	'08.00 pm',
	'09.00 pm',
	'10.00 pm',
	'11.00 pm',
];

const timeItems = computed(() => {
	return time_options.map((time) => ({ label: time }));
});

const props = defineProps<{ title: string; time: string | null; type: 'start' | 'end' }>();

const emit = defineEmits(['update:time']);

const time = computed({
	get() {
		return props.time ?? '';
	},
	set(time) {
		emit('update:time', time);
	},
});
</script>

<style scoped></style>
