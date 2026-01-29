<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<UFormField v-slot="{ error }" label="Code" name="code" required>
			<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Category Code" :disabled="isUpdate" />
		</UFormField>

		<UFormField v-slot="{ error }" label="Description" name="description" required>
			<UInput v-model="description" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Category Description" />
		</UFormField>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	isUpdate: Boolean,
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

<style scoped></style>
