<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[60%] md:w-[40%] lg:w-[30%]',
		}"
	>
		<UForm :schema="UpdateTaxValidation" :state="state.tax" class="space-y-4" @submit="onSubmit">
			<UCard>
				<template #header><h3>Update Tax</h3></template>

				<!-- *********************** General Info *********************** -->
				<ZInputTaxGeneralInfo
					v-model:code="state.tax.code"
					v-model:description="state.tax.description"
					v-model:is-inclusive="state.tax.is_inclusive"
					v-model:is-active="state.tax.is_active"
					is-update
				/>
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
import { UpdateTaxValidation } from '~/utils/schema';
import type { Tax } from '~/utils/types/tax';

type Schema = z.output<typeof UpdateTaxValidation>;

const props = defineProps({
	tax: {
		type: Object as PropType<Tax> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	tax: {
		code: props.tax.code,
		description: props.tax.description,
		is_inclusive: props.tax.is_inclusive,
		is_active: props.tax.is_active,
	},
});

const taxStore = useTaxStore();
const { updating } = storeToRefs(taxStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { description, is_inclusive, is_active } = event.data;

	emit('update', { description, is_inclusive, is_active });
};

const onDelete = () => {
	emit('delete');
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped lang="postcss"></style>
