<template>
	<UFormGroup name="categories" class="mt-2">
		<USelectMenu
			v-model="category"
			v-model:query="query"
			:options="productCategories"
			searchable
			size="md"
			value-attribute="id"
			option-attribute="name"
			placeholder="Select Category"
		/>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { ProductCategory } from '~/utils/types/product-category';

const query = ref('');
const categoryStore = useProductCategoriesStore();
const { productCategories } = storeToRefs(categoryStore);

const props = defineProps<{ category: ProductCategory | undefined }>();

const emit = defineEmits(['update:category']);

const category = computed({
	get() {
		return props.category ?? undefined;
	},
	set(value) {
		emit('update:category', value);
	},
});
</script>

<style></style>
