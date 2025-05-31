<template>
	<UFormGroup name="categories" class="mt-2">
		<USelectMenu v-model="categories" v-model:query="query" :options="category_options" searchable size="md" option-attribute="code" multiple by="code">
			<template #label>
				<span v-if="categories.length" class="truncate">{{ categories.map((category) => category.code).join(', ') }}</span>
				<span v-else class="text-gray-400">Select Categories</span>
			</template>

			<template #option-empty>
				<UButton color="green" variant="ghost">Create "{{ query }}"</UButton>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { Category, CategoryInput } from '~/utils/types/category';

const query = ref('');
const categoryStore = useProductCategoryStore();
const { categories: category_options } = storeToRefs(categoryStore);

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

<style scoped lang="postcss"></style>
