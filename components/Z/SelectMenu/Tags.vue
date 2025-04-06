<template>
	<UFormField name="tags" class="mt-2">
		<USelectMenu v-model="tags" v-model:query="query" :items="tag_options" searchable size="md" option-attribute="value" multiple by="id">
			<template #label>
				<span v-if="tags.length" class="truncate">{{ tags.map((tag) => tag.value).join(', ') }}</span>
				<span v-else class="text-neutral-400">Select Tags</span>
			</template>

			<template #option-empty>
				<UButton color="green" variant="ghost">Create "{{ query }}"</UButton>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import { useTagsStore } from '~/stores';
import type { Tag, TagInput } from '~/utils/types/tag';

const query = ref('');
const tagStore = useTagsStore();
const { tags: tag_options } = storeToRefs(tagStore);

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

<style scoped lang="postcss"></style>
