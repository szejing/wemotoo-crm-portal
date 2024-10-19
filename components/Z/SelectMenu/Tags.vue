<template>
	<UFormGroup name="tags" class="mt-2">
		<USelectMenu v-model="tags" v-model:query="query" :options="productTags" searchable size="md" value-attribute="name" option-attribute="name" multiple>
			<template #label>
				<span v-if="tags.length" class="truncate">{{ tags.join(', ') }}</span>
				<span v-else class="text-gray-400">Select Tags</span>
			</template>

			<template #option-empty>
				<UButton color="green" variant="ghost">Create "{{ query }}"</UButton>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { ProductTag } from '~/utils/types/product-tag';

const query = ref('');
const tagStore = useProductTagsStore();
const { productTags } = storeToRefs(tagStore);

const props = defineProps<{ tags: ProductTag[] | undefined }>();

const emit = defineEmits(['update:tags']);

const tags = computed({
	get() {
		return props.tags ?? [];
	},
	set(value) {
		emit('update:tags', value);
	},
});
</script>

<style></style>
