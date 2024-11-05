<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="ID" name="id" required>
			<UInput v-model="id" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="ID" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Name" name="name" required>
			<UInput v-model="name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Name" />
		</UFormGroup>

		<UFormGroup label="Description" name="description">
			<UInput v-model="description" placeholder="Description" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	id: String,
	name: String,
	description: String,
});

const emit = defineEmits(['update:id', 'update:name', 'update:description', 'update:parents']);

const id = computed({
	get() {
		return props.id;
	},
	set(value) {
		emit('update:id', value);
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
