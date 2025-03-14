<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Name" name="name" required>
			<UInput v-model="name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Name" />
		</UFormGroup>

		<UFormGroup label="Values" name="values" required>
			<InputTags v-model="values" placeholder="Values" class="flex-1 mt-2" :searchable="false" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	name: String,
	values: {
		type: Array as PropType<string[]>,
	},
});

const emit = defineEmits(['update:name', 'update:values']);

const name = computed({
	get() {
		return props.name;
	},
	set(value) {
		emit('update:name', value);
	},
});

const values = computed({
	get() {
		return props.values ?? [];
	},
	set(value) {
		emit('update:values', value);
	},
});
</script>

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
