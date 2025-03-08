<template>
	<div>
		<UForm :schema="CreateCategoryValidation" :state="newCategory" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputCategoryGeneralInfo v-model:code="newCategory.code" v-model:name="newCategory.name" v-model:description="newCategory.description" />
			<!-- *********************** General Info *********************** -->

			<div>
				<h4>Parent Category</h4>
				<ZSelectMenuCategory v-model:category="newCategory.parent_category" />
			</div>

			<div>
				<h4>Thumbnail</h4>
				<ZDropzoneSingle :url-single="newCategory.thumbnail" @update:url-single="updateThumbnail" />
			</div>

			<div class="flex-center text-center mt-3">
				<UButton size="md" color="green" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { useCategoriesStore } from '~/stores/Categories/Categories';

import { CreateCategoryValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateCategoryValidation>;

const categoryStore = useCategoriesStore();
const { adding, newCategory } = storeToRefs(categoryStore);

onMounted(() => {
	categoryStore.resetNewCategory();
});

const updateThumbnail = (url: string) => {
	newCategory.value.thumbnail = url;
};
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, name, description, is_internal, is_active, images, thumbnail, parent_category } = event.data;
	await categoryStore.addCategory(code, name, description, is_internal, is_active, images, thumbnail, parent_category);
};
</script>

<style scoped lang="css"></style>
