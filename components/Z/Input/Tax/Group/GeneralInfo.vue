<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Code" name="code" :required="!isUpdate">
			<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Code" :disabled="isUpdate" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Description" name="description" required>
			<UInput v-model="description" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Description" />
		</UFormGroup>

		<UFormGroup label="Taxes" name="taxes">
			<ZSelectMenuTax v-model:taxes="taxes" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
import type { Tax, TaxInput } from '~/utils/types/tax';

const props = defineProps({
	code: String,
	description: String,
	taxes: Array as PropType<Tax[] | TaxInput[] | undefined>,
	isUpdate: Boolean,
});

const emit = defineEmits(['update:code', 'update:description', 'update:taxes']);

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

const taxes = computed({
	get() {
		return props.taxes ?? [];
	},
	set(value) {
		emit('update:taxes', value);
	},
});
</script>

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
