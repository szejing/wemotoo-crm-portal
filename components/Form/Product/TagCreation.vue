<template>
	<div>
		<UForm :schema="CreateTagValidation" :state="newTag" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputTagGeneralInfo v-model:value="newTag.value" />
			<!-- *********************** General Info *********************** -->
			<div class="flex-center text-center mt-3">
				<UButton size="md" color="green" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { useTagsStore } from '~/stores/Tags/Tags';

import { CreateTagValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateTagValidation>;

const tagStore = useTagsStore();
const { adding, newTag } = storeToRefs(tagStore);

onMounted(() => {
	tagStore.resetNewTag();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { value } = event.data;
	await tagStore.addTag(value);
};
</script>

<style scoped lang="css"></style>
