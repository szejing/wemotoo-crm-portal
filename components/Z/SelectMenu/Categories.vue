<template>
	<UFormGroup name="categories" class="mt-2">
		<USelectMenu
			v-model="categories"
			v-model:query="query"
			:options="options_categories"
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
const { productCategories: options_categories } = storeToRefs(categoryStore);

const props = defineProps<{ productCategories: ProductCategory[] }>();

const emit = defineEmits(['update:productCategories']);

const categories = computed({
	get() {
		return props.productCategories;
	},
	set(value) {
		emit('update:productCategories', value);
	},
});
</script>

<style></style>
