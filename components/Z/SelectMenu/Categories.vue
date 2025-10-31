<template>
	<UFormField name="categories" class="mt-2">
		<USelectMenu v-model="categories" v-model:search-term="searchTerm" :items="categoryItems" :search-input="{}" size="md" value-key="code" multiple>
			<template #default>
				<span v-if="categories.length" class="truncate">{{ categories.map((category: Category) => category.code).join(', ') }}</span>
				<span v-else class="text-neutral-400">Select Categories</span>
			</template>

			<template #empty>
				<UButton color="success" variant="ghost">Create "{{ searchTerm }}"</UButton>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import type { Category, CategoryInput } from '~/utils/types/category';

const searchTerm = ref('');
const categoryStore = useProductCategoryStore();
const { categories: category_options } = storeToRefs(categoryStore);

const categoryItems = computed(() => {
	return category_options.value.map((category) => ({
		...category,
		label: category.code,
	}));
});

const props = defineProps<{ categories: Category[] | CategoryInput[] | undefined }>();

const emit = defineEmits(['update:categories']);

const categories = computed({
	get() {
		return props.categories ?? [];
	},
	set(value) {
		emit('update:categories', JSON.parse(JSON.stringify(value)));
	},
});
</script>

<style scoped></style>
