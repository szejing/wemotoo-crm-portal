<template>
	<UFormGroup name="categories" class="mt-2">
		<USelectMenu
			v-model="categories"
			v-model:query="query"
			:options="productCategories"
			searchable
			size="md"
			value-attribute="name"
			option-attribute="name"
			multiple
		>
			<template #label>
				<span v-if="categories.length" class="truncate">{{ categories.join(', ') }}</span>
				<span v-else class="text-gray-400">Select Categories</span>
			</template>

			<template #option-empty>
				<UButton color="green" variant="ghost">Create "{{ query }}"</UButton>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { ProductCategory } from '~/utils/types/product-category';

const query = ref('');
const categoryStore = useProductCategoriesStore();
const { productCategories } = storeToRefs(categoryStore);

const props = defineProps<{ categories: ProductCategory[] | undefined }>();

const emit = defineEmits(['update:categories']);

const categories = computed({
	get() {
		return props.categories ?? [];
	},
	set(value) {
		emit('update:categories', value);
	},
});
</script>

<style></style>
