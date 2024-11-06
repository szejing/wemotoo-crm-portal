<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[30%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Product Tag</h3></template>
			<UForm :schema="UpdateProductTagValidation" :state="state.tag" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputTagGeneralInfo v-model:value="state.tag.value" />
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
import { UpdateProductTagValidation } from '~/utils/schema';
import type { ProductTag } from '~/utils/types/product-tag';

type Schema = z.output<typeof UpdateProductTagValidation>;

const props = defineProps({
	productTag: {
		type: Object as PropType<ProductTag> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'cancel']);

const state = reactive({
	tag: props.productTag,
});

const tagStore = useProductTagsStore();
const { updating } = storeToRefs(tagStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { value } = event.data;

	if (value === '' || value === undefined) {
		return;
	}

	emit('update', state.tag);
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style></style>
