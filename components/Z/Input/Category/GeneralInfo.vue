<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Code" name="code" required>
			<UInput v-model="code" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" placeholder="Code" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Name" name="name" required>
			<UInput v-model="name" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" placeholder="Name" />
		</UFormGroup>

		<UFormGroup label="Description" name="description">
			<UInput v-model="description" placeholder="Description" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	code: String,
	name: String,
	description: String,
});

const emit = defineEmits(['update:code', 'update:name', 'update:description', 'update:parents']);

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
	@apply grid grid-cols-1 gap-3;
}
</style>
