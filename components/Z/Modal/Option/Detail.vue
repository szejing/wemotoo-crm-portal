<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[30%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Product Option</h3></template>
			<UForm :schema="UpdateProductOptionValidation" :state="state.option" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->

				<UFormGroup v-slot="{ error }" label="Name" name="name" required>
					<UInput v-model="state.option.name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Name" />
				</UFormGroup>

				<div v-if="state.option.values.length > 0">
					<h6>Values</h6>
					<div v-for="(value, index) in state.option.values" :key="index" class="w-full flex-jbetween-icenter space-y-2">
						<h5 class="text-neutral-300">#{{ value.id }}</h5>

						<UFormGroup v-slot="{ error }" name="value" required>
							<UInput v-model="state.option.values[index].value" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Value" />
						</UFormGroup>
					</div>
				</div>

				<div class="flex-jend w-full mt-3">
					<UButton size="md" color="green" variant="outline" block @click="onAddNew">Create</UButton>
				</div>

				<!-- *********************** General Info *********************** -->

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
					<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { useTagsStore } from '~/stores';
import { UpdateProductOptionValidation } from '~/utils/schema';
import type { ProductOption } from '~/utils/types/product-option';

type Schema = z.output<typeof UpdateProductOptionValidation>;

const props = defineProps({
	productOption: {
		type: Object as PropType<ProductOption> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'cancel']);

const state = reactive({
	option: { name: props.productOption.name, values: props.productOption.values },
});

const tagStore = useTagsStore();
const { updating } = storeToRefs(tagStore);

const onAddNew = () => {
	if (state.option.values[state.option.values.length - 1].value === undefined || state.option.values[state.option.values.length - 1].value === '') {
		return;
	}

	state.option.values.push({ value: '', metadata: null });
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, values } = event.data;

	if (name === '' || name === undefined) {
		return;
	}

	emit('update', name, values ?? []);
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped lang="postcss"></style>
