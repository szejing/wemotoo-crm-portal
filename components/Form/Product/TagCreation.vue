<template>
	<div>
		<UForm :schema="CreateProductTagValidation" :state="newProductTag" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputTagGeneralInfo v-model:name="newProductTag.name" />
			<!-- *********************** General Info *********************** -->

			<div class="flex-center text-center mt-3">
				<UButton class="w-[100%] sm:w-[50%]" size="md" color="green" variant="solid" type="submit" block>Create</UButton>
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
const { newProductTag } = storeToRefs(tagStore);

onMounted(() => {
	tagStore.resetNewProductTag();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event);
};
</script>

<style scoped lang="css"></style>
