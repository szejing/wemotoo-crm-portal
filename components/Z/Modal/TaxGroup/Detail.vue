<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[60%] md:w-[40%] lg:w-[30%]',
		}"
	>
		<UForm :schema="UpdateTaxGroupValidation" :state="state.tax" class="space-y-4" @submit="onSubmit">
			<UCard>
				<template #header><h3>Update Tax Group</h3></template>

				<!-- *********************** General Info *********************** -->
				<ZInputTaxGroupGeneralInfo v-model:code="state.tax.code" v-model:description="state.tax.description" v-model:taxes="state.tax.taxes" is-update />
				<!-- *********************** General Info *********************** -->

				<template #footer>
					<div class="flex-jbetween-icenter">
						<UButton color="danger" variant="ghost" @click="onDelete">Delete</UButton>

						<div class="flex-jend gap-4">
							<UButton color="neutral" variant="soft" @click="onCancel">Cancel</UButton>
							<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
						</div>
					</div>
				</template>
			</UCard>
		</UForm>
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

<style scoped lang="postcss"></style>
