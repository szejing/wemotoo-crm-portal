<template>
	<div>
		<UForm :schema="CreateCategoryValidation" :state="newCategory" class="space-y-4" @submit="onSubmit">
			<ZDropzone type="category" @files-selected="updateThumbnail" />

			<!-- *********************** General Info *********************** -->
			<ZInputProductCategoryGeneralInfo v-model:code="newCategory.code" v-model:name="newCategory.name" v-model:description="newCategory.description" />
			<!-- *********************** General Info *********************** -->

			<!-- <div>
				<h4>Parent Category</h4>
				<ZSelectMenuCategory v-model:category="newCategory.parent_category" />
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
const { adding, newCategory } = storeToRefs(categoryStore);

onMounted(() => {
	categoryStore.resetNewCategory();
});

// const parent_category_code = computed(() => {
// 	return newCategory.value.parent_category_code;
// });

const updateThumbnail = (files: File[]) => {
	newCategory.value.thumbnail = files[0];
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, name, description, is_internal, is_active, parent_category } = event.data;

	newCategory.value.code = code;
	newCategory.value.name = name;
	newCategory.value.description = description;
	newCategory.value.is_internal = is_internal;
	newCategory.value.is_active = is_active;
	newCategory.value.parent_category_code = parent_category?.code ?? undefined;

	await categoryStore.createCategory();
};
</script>

<style scoped lang="postcss"></style>
