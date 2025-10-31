<template>
	<UFormField name="tags" class="mt-2">
		<USelectMenu v-model="tags" v-model:search-term="searchTerm" :items="tagItems" :search-input="{}" size="md" value-key="id" multiple>
			<template #default>
				<span v-if="tags.length" class="truncate">{{ tags.map((tag: Tag) => tag.value).join(', ') }}</span>
				<span v-else class="text-neutral-400">Select Tags</span>
			</template>

			<template #empty>
				<UButton color="success" variant="ghost">Create "{{ searchTerm }}"</UButton>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import type { Tag, TagInput } from '~/utils/types/tag';

const searchTerm = ref('');
const tagStore = useProductTagStore();
const { tags: tag_options } = storeToRefs(tagStore);

const tagItems = computed(() => {
	return tag_options.value.map((tag) => ({
		...tag,
		label: tag.value,
	}));
});

const props = defineProps<{ tags: Tag[] | TagInput[] | undefined }>();

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

<style scoped></style>
