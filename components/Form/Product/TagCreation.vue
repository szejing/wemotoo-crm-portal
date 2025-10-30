<template>
	<div>
		<UForm :schema="CreateTagValidation" :state="new_tag" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputProductTagGeneralInfo v-model:value="new_tag.value" />
			<!-- *********************** General Info *********************** -->
			<div class="flex-center text-center mt-3">
				<UButton size="md" color="success" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateTagValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateTagValidation>;

const tagStore = useProductTagStore();
const { adding, new_tag } = storeToRefs(tagStore);

onMounted(() => {
	tagStore.resetNewTag();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { value } = event.data;
	await tagStore.addTag(value);
};
</script>

<style scoped></style>
