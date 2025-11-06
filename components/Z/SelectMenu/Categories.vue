<template>
	<USelectMenu
		v-model="categories"
		v-model:search-term="searchTerm"
		:items="items"
		size="md"
		label-key="code"
		description-key="description"
		multiple
		placeholder="Select Categories"
	>
		<template #empty>
			<UButton color="success" variant="ghost">Create "{{ searchTerm }}"</UButton>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { Category } from '~/utils/types/category';

const searchTerm = ref('');
const categoryStore = useProductCategoryStore();
const { categories: items } = storeToRefs(categoryStore);

const props = defineProps<{ categories: Category[] | undefined }>();

const emit = defineEmits(['update:categories']);

const categories = computed<Category[]>({
	get() {
		return props.categories ?? [];
	},
	set(value) {
		emit('update:categories', JSON.parse(JSON.stringify(value)));
	},
});
</script>

<style scoped></style>
