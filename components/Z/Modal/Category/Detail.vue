<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[30%]',
		}"
	>
		<UCard>
			<UForm :schema="UpdateCategoryValidation" :state="state.category" class="space-y-4" @submit="onSubmit">
				<div class="flex-jbetween-icenter gap-4">
					<h3>Update Category</h3>
					<UCheckbox v-model="state.category.is_active" name="isActive" label="Active" color="green" />
				</div>

				<div class="w-[100%]">
					<ZDropzone type="category" class="mt-2" :existing-images="[state.category.thumbnail]" @files-selected="updateThumbnail" />
				</div>

				<!-- *********************** General Info *********************** -->
				<ZInputProductCategoryGeneralInfo
					v-model:code="state.category.code"
					v-model:name="state.category.name"
					v-model:description="state.category.description"
				/>
				<!-- *********************** General Info *********************** -->

				<!-- <div>
					<h4>Parent Category</h4>
					<ZSelectMenuCategory v-model:category="state.category.parent_category" :ignore-codes="[state.category.code]" />
				</div> -->

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
import { UpdateCategoryValidation } from '~/utils/schema';
import type { Category } from '~/utils/types/category';

type Schema = z.output<typeof UpdateCategoryValidation>;

const props = defineProps({
	category: {
		type: Object as PropType<Category> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'cancel']);

const state = reactive({
	category: props.category,
});

const categoryStore = useProductCategoryStore();
const { updating } = storeToRefs(categoryStore);
const newThumbnail = ref<File | null>(null);

const updateThumbnail = (files: File[]) => {
	newThumbnail.value = files[0];
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, name, description, is_active, is_internal, thumbnail, parent_category } = event.data;
	emit('update', { code, name, description, is_active, is_internal, images: null, thumbnail, parent_category });
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped lang="postcss"></style>
