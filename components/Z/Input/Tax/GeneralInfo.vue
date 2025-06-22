<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Code" name="code" :required="!isUpdate">
			<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Code" :disabled="isUpdate" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Description" name="description" required>
			<UInput v-model="description" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Description" />
		</UFormGroup>

		<div class="grid grid-cols-2 gap-4">
			<UFormGroup v-slot="{ error }" label="Inclusive" name="isInclusive" required>
				<UCheckbox v-model="isInclusive" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Is Inclusive" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Active" name="isActive" required>
				<UToggle v-model="isActive" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Is Active" />
			</UFormGroup>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	code: String,
	description: String,
	isInclusive: Boolean,
	isActive: Boolean,
	isUpdate: Boolean,
});

const emit = defineEmits(['update:code', 'update:description', 'update:isInclusive', 'update:isActive']);

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

const isInclusive = computed({
	get() {
		return props.isInclusive;
	},
	set(value) {
		emit('update:isInclusive', value);
	},
});

const isActive = computed({
	get() {
		return props.isActive;
	},
	set(value) {
		emit('update:isActive', value);
	},
});
</script>

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
