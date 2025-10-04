<template>
	<div>
		<UForm :schema="CreateCategoryValidation" :state="new_category" class="space-y-4" @submit="onSubmit">
			<ZDropzone @files-selected="updateThumbnail" />

			<!-- *********************** General Info *********************** -->
			<ZInputProductCategoryGeneralInfo v-model:code="new_category.code" v-model:description="new_category.description" />
			<!-- *********************** General Info *********************** -->

			<!-- <div>
				<h4>Parent Category</h4>
				<ZSelectMenuCategory v-model:category="new_category.parent_category" />
			</div> -->

			<div class="flex-center text-center mt-3">
				<UButton size="md" color="green" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateCategoryValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateCategoryValidation>;

const categoryStore = useProductCategoryStore();
const { adding, new_category } = storeToRefs(categoryStore);

onMounted(() => {
	categoryStore.resetNewCategory();
});

// const parent_category_code = computed(() => {
// 	return new_category.value.parent_category_code;
// });

const updateThumbnail = (files: File[]) => {
	new_category.value.thumbnail = files[0];
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, is_internal, is_active, parent_category } = event.data;

	new_category.value.code = code;
	new_category.value.description = description;
	new_category.value.is_internal = is_internal;
	new_category.value.is_active = is_active;
	new_category.value.parent_category_code = parent_category?.code ?? undefined;

	await categoryStore.createCategory();
};
</script>

<style scoped lang="postcss"></style>
