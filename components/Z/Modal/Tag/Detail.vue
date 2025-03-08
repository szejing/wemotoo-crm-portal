<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[30%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Tag</h3></template>
			<UForm :schema="UpdateTagValidation" :state="state.tag" class="space-y-4" @submit="onSubmit">
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
import { useTagsStore } from '~/stores/Tags/Tags';
import { UpdateTagValidation } from '~/utils/schema';
import type { Tag } from '~/utils/types/tag';

type Schema = z.output<typeof UpdateTagValidation>;

const props = defineProps({
	tag: {
		type: Object as PropType<Tag> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'cancel']);

const state = reactive({
	tag: props.tag,
});

const tagStore = useTagsStore();
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
