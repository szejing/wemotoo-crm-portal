<template>
	<div>
		<UForm :schema="CreateProductTagValidation" :state="newProductTag" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputTagGeneralInfo v-model:value="newProductTag.value" />
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

import { CreateProductTagValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductTagValidation>;

const tagStore = useProductTagsStore();
const { adding, newProductTag } = storeToRefs(tagStore);

onMounted(() => {
	tagStore.resetNewProductTag();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { value } = event.data;
	await tagStore.addProductTag(value);
};
</script>

<style scoped lang="css"></style>
