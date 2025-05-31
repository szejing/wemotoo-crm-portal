<template>
	<UFormGroup name="categories" class="mt-2">
		<USelectMenu
			v-model="category"
			v-model:query="query"
			:options="availableCategories"
			searchable
			size="md"
			placeholder="Select Category"
			option-attribute="code"
			by="code"
		>
			<template #label>
				<span v-if="category" class="truncate">
					<div class="flex items-center gap-2">
						<p class="text-neutral-700 font-semibold">[{{ category.code }}]</p>
					</div>
				</span>
				<span v-else>Select Category</span>
			</template>

			<template #option="{ option: catg }">
				<div class="flex items-center gap-2">
					<p class="text-neutral-300 font-light">[{{ catg.code }}]</p>
					<p class="text-neutral-700 font-semibold">{{ catg.name }}</p>
				</div>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { Category } from '~/utils/types/category';

const query = ref('');
const categoryStore = useProductCategoryStore();
const { categories } = storeToRefs(categoryStore);

const props = defineProps<{ category: Category | undefined; ignoreCodes?: string[] }>();

const availableCategories = computed(() => {
	return categories.value.filter((catg) => !props.ignoreCodes?.includes(catg.code));
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

<style scoped lang="postcss"></style>
