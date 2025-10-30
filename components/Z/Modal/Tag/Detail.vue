<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[60%] md:w-[40%] lg:w-[30%]',
		}"
	>
		<UForm :schema="UpdateTagValidation" :state="state.tag" class="space-y-4" @submit="onSubmit">
			<UCard>
				<template #header><h3>Update Tag</h3></template>
				<!-- *********************** General Info *********************** -->
				<ZInputProductTagGeneralInfo v-model:value="state.tag.value" />
				<!-- *********************** General Info *********************** -->

				<template #footer>
					<div class="flex-jbetween-icenter">
						<UButton color="error" variant="ghost" @click="onDelete">Delete</UButton>

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
import { UpdateTagValidation } from '~/utils/schema';
import type { Tag } from '~/utils/types/tag';

type Schema = z.output<typeof UpdateTagValidation>;

const props = defineProps({
	tag: {
		type: Object as PropType<Tag> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	tag: props.tag,
});

const tagStore = useProductTagStore();
const { updating } = storeToRefs(tagStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { value } = event.data;

	if (value === '' || value === undefined) {
		return;
	}

	emit('update', state.tag);
};

const onDelete = () => {
	emit('delete');
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped></style>
