<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Product Code" name="code" required>
			<UInput v-model="code" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Name" name="name" required>
			<UInput v-model="name" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Description" name="description" required>
			<UInput v-model="description" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	code: String,
	name: String,
	description: String,
});

const emit = defineEmits(['update:code', 'update:name', 'update:description']);

const code = computed({
	get() {
		return props.code;
	},
	set(value) {
		emit('update:code', value);
	},
});

const name = computed({
	get() {
		return props.name;
	},
	set(value) {
		emit('update:name', value);
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

<style scoped lang="css">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-4;
}
</style>
