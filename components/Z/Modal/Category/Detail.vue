<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[30%]',
		}"
	>
		<UForm :schema="UpdateCategoryValidation" :state="state.category" class="space-y-4" @submit="onSubmit">
			<UCard>
				<div class="flex-jbetween-icenter gap-4">
					<h3>Update Category</h3>
					<UCheckbox v-model="state.category.is_active" name="isActive" label="Active" color="green" />
				</div>

				<div class="w-[100%]">
					<ZDropzone type="category" class="mt-2" :existing-images="[state.category.thumbnail]" @files-selected="updateThumbnail" />
				</div>

				<div class="w-[100%] hidden">
					<ZDropzone type="category" class="mt-2" multiple :existing-images="state.category.images" @files-selected="updateImages" />
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

				<template #footer>
					<div class="flex-jbetween-icenter">
						<UButton color="danger" variant="ghost" @click="onDelete">Delete</UButton>

						<div class="flex-jend gap-4">
							<UButton color="neutral" variant="soft" @click="onCancel">Cancel</UButton>
							<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
						</div>
					</div>
				</template>
			</UCard>
		</UForm>
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
const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	category: props.category,
});

const categoryStore = useProductCategoryStore();
const { updating } = storeToRefs(categoryStore);
const newThumbnail = ref<File>();
const newImages = ref<File[]>();

const updateThumbnail = (files: File[]) => {
	newThumbnail.value = files[0];
};

const updateImages = (files: File[]) => {
	newImages.value = files;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, name, description, is_active, is_internal, parent_category } = event.data;
	emit('update', { code, name, description, is_active, is_internal, parent_category, thumbnail: newThumbnail.value, images: newImages.value });
};

const onCancel = () => {
	emit('cancel');
};

const onDelete = () => {
	emit('delete');
};
</script>

<style scoped lang="postcss"></style>
