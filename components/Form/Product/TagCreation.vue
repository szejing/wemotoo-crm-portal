<template>
	<UForm :schema="CreateTagValidation" :state="new_tag" class="space-y-4" @submit="onSubmit">
		<!-- *********************** General Info *********************** -->
		<div class="space-y-2">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">General Information</h3>
			<ZInputProductTagGeneralInfo v-model:value="new_tag.value" />
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center pt-4">
			<UButton color="success" size="md" :loading="adding">
				<UIcon :name="ICONS.CHECK_ROUNDED" class="w-4 h-4" />
				<span class="text-sm">Create Tag</span>
			</UButton>
		</div>
	</UForm>
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
