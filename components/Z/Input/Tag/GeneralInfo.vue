<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Value" name="value" required>
			<UInput v-model="value" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" placeholder="Value" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	code: String,
	value: String,
	description: String,
});

const emit = defineEmits(['update:value']);

const value = computed({
	get() {
		return props.value;
	},
	set(value) {
		emit('update:value', value);
	},
});
</script>

<style scoped lang="css">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
