<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[30%]',
		}"
	>
		<UCard>
			<UForm :schema="UpdateProductCategoryValidation" :state="state.category" class="space-y-4" @submit="onSubmit">
				<div class="flex-jbetween-icenter gap-4">
					<h3>Update Product Category</h3>
					<UCheckbox v-model="state.category.is_active" name="isActive" label="Active" color="green" />
				</div>
				<!-- *********************** General Info *********************** -->
				<ZInputCategoryGeneralInfo v-model:code="state.category.code" v-model:name="state.category.name" v-model:description="state.category.description" />
				<!-- *********************** General Info *********************** -->

				<div>
					<h4>Parent Category</h4>
					<ZSelectMenuCategory v-model:category="state.category.parent_category" />
				</div>

				<div class="w-[50%]">
					<h4>Thumbnail</h4>
					<ZDropzoneSingle :url-single="state.category.thumbnail" @update:url-single="updateThumbnail" />
				</div>

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
import { UpdateProductCategoryValidation } from '~/utils/schema';
import type { ProductCategory } from '~/utils/types/product-category';

type Schema = z.output<typeof UpdateProductCategoryValidation>;

const props = defineProps({
	productCategory: {
		type: Object as PropType<ProductCategory> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'cancel']);

const state = reactive({
	category: props.productCategory,
});

const categoryStore = useProductCategoriesStore();
const { updating } = storeToRefs(categoryStore);

const updateThumbnail = (url: string) => {
	state.category.thumbnail = url;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { id, name, description, is_active, is_internal, thumbnail, parent_category } = event.data;
	emit('update', { id, name, description, is_active, is_internal, images: null, thumbnail, parent_category });
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style></style>
