<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Value" name="value" required>
			<UInput v-model="value" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Value" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	value: String,
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

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
