<template>
	<USelectMenu
		v-model="category"
		v-model:search-term="searchTerm"
		:items="items"
		:search-input="{}"
		size="md"
		label-key="code"
		description-key="description"
		placeholder="Select Category"
	/>
</template>

<script lang="ts" setup>
import type { SelectMenuItem } from '@nuxt/ui';
import type { Category } from '~/utils/types/category';

const searchTerm = ref('');
const categoryStore = useProductCategoryStore();
const { categories } = storeToRefs(categoryStore);

const props = defineProps<{ category: Category | undefined; ignoreCodes?: string[] }>();

const availableCategories = computed(() => {
	return categories.value.filter((catg) => !props.ignoreCodes?.includes(catg.code));
});

const items = computed<SelectMenuItem[]>(() => {
	return availableCategories.value.map((category) => ({
		...category,
		label: category.code,
		description: category.description,
	}));
});

const emit = defineEmits(['update:category']);

const category = computed({
	get() {
		return props.category ?? undefined;
	},
	set(value) {
		emit('update:category', JSON.parse(JSON.stringify(value)));
	},
});
</script>

<style scoped></style>
