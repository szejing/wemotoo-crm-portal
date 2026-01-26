<template>
	<UModal
		title="Update Tax Group"
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #body>
			<UForm :schema="UpdateTaxGroupValidation" :state="state.tax" class="space-y-4" @submit="onSubmit">
				<ZInputTaxGroupGeneralInfo v-model:code="state.tax.code" v-model:description="state.tax.description" v-model:taxes="state.tax.taxes" is-update />
			</UForm>
		</template>

		<template #footer>
			<div class="flex-jbetween-icenter w-full">
				<UButton color="error" variant="ghost" class="opacity-50 hover:opacity-100" @click="onDelete">Delete</UButton>

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="soft" @click="onCancel">Cancel</UButton>
					<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { UpdateTaxGroupValidation } from '~/utils/schema';
import type { TaxGroup } from '~/utils/types/tax-group';

type Schema = z.output<typeof UpdateTaxGroupValidation>;

const props = defineProps({
	taxGroup: {
		type: Object as PropType<TaxGroup> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	tax: {
		code: props.taxGroup.code,
		description: props.taxGroup.description,
		taxes: props.taxGroup.taxes,
	},
});

const taxStore = useTaxStore();
const { updating } = storeToRefs(taxStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { description, taxes } = event.data;

	emit('update', { description, taxes });
};

const onDelete = () => {
	emit('delete');
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped></style>
