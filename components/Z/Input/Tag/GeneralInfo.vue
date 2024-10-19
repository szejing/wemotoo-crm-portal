<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Name" name="name" required>
			<UInput v-model="name" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	code: String,
	name: String,
	description: String,
});

const emit = defineEmits(['update:name']);

const name = computed({
	get() {
		return props.name;
	},
	set(value) {
		emit('update:name', value);
	},
});
</script>

<style scoped lang="css">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
