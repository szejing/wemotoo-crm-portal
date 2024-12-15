<template>
	<UFormGroup name="categories" class="mt-2">
		<USelectMenu
			v-model="category"
			v-model:query="query"
			:options="availableCategories"
			searchable
			size="md"
			value-attribute="code"
			placeholder="Select Category"
		>
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
import type { ProductCategory } from '~/utils/types/product-category';

const query = ref('');
const categoryStore = useProductCategoriesStore();
const { productCategories } = storeToRefs(categoryStore);

const props = defineProps<{ category: ProductCategory | undefined; ignoreCodes?: string[] }>();

const availableCategories = computed(() => {
	return productCategories.value.filter((catg) => !props.ignoreCodes?.includes(catg.code));
});

const emit = defineEmits(['update:category']);

const category = computed({
	get() {
		return props.category ?? undefined;
	},
	set(value) {
		emit('update:category', value);
	},
});

console.log(category.value);
</script>

<style></style>
