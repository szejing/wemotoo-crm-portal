<template>
	<UModal
		title="Update Product Option"
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #body>
			<UForm :schema="UpdateProductOptionValidation" :state="state.option" class="space-y-4" @submit="onSubmit">
				<UFormField v-slot="{ error }" label="Name" name="name" required>
					<UInput v-model="state.option.name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Name" />
				</UFormField>

				<div class="mt-4">
					<h6 class="text-secondary-700 text-sm font-bold">Values</h6>
					<div v-if="state.option.values.length > 0">
						<div v-for="(value, index) in state.option.values" :key="index" class="w-full flex-jbetween-icenter space-y-2">
							<h5 class="text-neutral-300">#{{ value.id }}</h5>

							<UFormField v-slot="{ error }" name="value" required>
								<UInput v-model="state.option.values[index]?.value" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Value" />
							</UFormField>
						</div>
					</div>
				</div>

				<div class="flex-jend w-full mt-3">
					<UButton size="md" color="success" variant="outline" block @click="onAddNew">Create</UButton>
				</div>

				<!-- *********************** General Info *********************** -->
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
import { UpdateProductOptionValidation } from '~/utils/schema';
import type { ProductOption } from '~/utils/types/product-option';

type Schema = z.output<typeof UpdateProductOptionValidation>;

const props = defineProps({
	productOption: {
		type: Object as PropType<ProductOption> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	option: { name: props.productOption.name, values: props.productOption.values },
});

const tagStore = useProductTagStore();
const { updating } = storeToRefs(tagStore);

const onAddNew = () => {
	if (state.option.values[state.option.values.length - 1]?.value === undefined || state.option.values[state.option.values.length - 1]?.value === '') {
		return;
	}

	state.option.values.push({ value: '', metadata: undefined, id: 0, option_id: 0 });
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, values } = event.data;

	if (name === '' || name === undefined) {
		return;
	}

	const newValues = values?.map((v) => {
		return {
			...v,
			option_id: props.productOption.id!,
		};
	});

	emit('update', name, newValues ?? []);
};

const onDelete = () => {
	emit('delete');
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped></style>
