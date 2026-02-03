<template>
	<UModal
		:title="$t('components.zModal.updateTax')"
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #body>
			<UForm :schema="taxSchema" :state="state.tax" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputTaxGeneralInfo
					v-model:code="state.tax.code"
					v-model:description="state.tax.description"
					v-model:is-inclusive="state.tax.is_inclusive"
					v-model:is-active="state.tax.is_active"
					is-update
				/>
			</UForm>
		</template>

		<template #footer>
			<div class="flex-jbetween-icenter w-full">
				<UButton color="error" variant="ghost" class="opacity-50 hover:opacity-100" @click="onDelete">{{ $t('components.zModal.delete') }}</UButton>

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="soft" @click="onCancel">{{ $t('common.cancel') }}</UButton>
					<UButton color="primary" variant="solid" :loading="updating" type="submit">{{ $t('components.zModal.update') }}</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { createUpdateTaxValidation } from '~/utils/schema';
import type { Tax } from '~/utils/types/tax';

const { t } = useI18n();
const taxSchema = computed(() => createUpdateTaxValidation(t));

type Schema = z.output<ReturnType<typeof createUpdateTaxValidation>>;

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

<style scoped></style>
