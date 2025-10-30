<template>
	<div class="section-grid-basic-details">
		<UFormField v-slot="{ error }" label="Code" name="code" required>
			<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Code" />
		</UFormField>

		<UFormField v-slot="{ error }" label="Description" name="description" required>
			<UInput v-model="description" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Description" />
		</UFormField>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	code: String,
	description: String,
});

const emit = defineEmits(['update:code', 'update:description']);

const code = computed({
	get() {
		return props.code;
	},
	set(value) {
		emit('update:code', value?.toUpperCase());
	},
});

const description = computed({
	get() {
		return props.description;
	},
	set(value) {
		emit('update:description', value);
	},
});
</script>

<style scoped>
.section-grid-basic-details {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 0.75rem;
}
</style>
