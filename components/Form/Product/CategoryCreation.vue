<template>
	<UForm :schema="CreateCategoryValidation" :state="new_category" class="space-y-6" @submit="onSubmit">
		<div class="space-y-6">
			<!-- Thumbnail Upload Section -->
			<div class="space-y-2">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Category Thumbnail</h3>
				<ZDropzone @files-selected="updateThumbnail" />
			</div>

			<!-- *********************** General Info *********************** -->
			<div class="space-y-2">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">General Information</h3>
				<ZInputProductCategoryGeneralInfo v-model:code="new_category.code" v-model:description="new_category.description" />
			</div>
			<!-- *********************** General Info *********************** -->

			<!-- Parent Category Section -->
			<div class="space-y-2">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Parent Category</h3>
				<ZSelectMenuCategory
					v-model:category="new_category.parent_category"
					:ignore-codes="[new_category.code]"
					placeholder="Select parent category..."
					class="sm:w-[50%] w-full"
				/>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center pt-4">
			<UButton color="success" size="md" :loading="adding" type="submit">
				<UIcon :name="ICONS.CHECK_ROUNDED" class="w-4 h-4" />
				<span class="text-sm">Create Category</span>
			</UButton>
		</div>
	</UForm>
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

	if (parent_category) {
		new_category.value.parent_category = {
			code: parent_category.code!,
		};
	}

	const success = await categoryStore.createCategory();

	if (success) {
		useRouter().back();
	}
};
</script>

<style scoped></style>
