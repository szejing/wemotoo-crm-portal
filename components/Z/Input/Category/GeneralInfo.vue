<template>
	<div class="section-grid-basic-details">
		<UFormField v-slot="{ error }" label="Code" name="code" required>
			<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Code" />
		</UFormField>

		<UFormField v-slot="{ error }" label="Name" name="name" required>
			<UInput v-model="name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Name" />
		</UFormField>

		<UFormField label="Description" name="description">
			<UInput v-model="description" placeholder="Description" />
		</UFormField>
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
		emit('update:code', value?.toUpperCase());
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

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
