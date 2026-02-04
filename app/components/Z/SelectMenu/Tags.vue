<template>
	<USelectMenu v-model="tags" v-model:search-term="searchTerm" :items="items" :search-input="{}" size="md" multiple label-key="value" :placeholder="$t('components.selectMenu.selectTags')">
		<template #default>
			<div v-if="tags && tags.length > 0" class="flex flex-wrap gap-1.5">
				<div
					v-for="tag in tags"
					:key="tag.value"
					class="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1"
				>
					<p class="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{{ tag.value }}</p>
					<UIcon
						:name="ICONS.CROSS"
						class="w-4 h-4 shrink-0 text-error-500 dark:text-error-400 hover:text-error-600 dark:hover:text-error-300 transition-colors ml-2 cursor-pointer"
						@click.stop="remove(tag)"
					/>
				</div>
			</div>
			<span v-else class="text-neutral-400 text-sm">{{ $t('components.selectMenu.selectTags') }}</span>
		</template>

		<template #empty>
			<UButton color="success" variant="ghost">{{ $t('components.selectMenu.createLabel', { term: searchTerm }) }}</UButton>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { Tag } from '~/utils/types/tag';

const searchTerm = ref('');
const tagStore = useProductTagStore();
const { tags: items } = storeToRefs(tagStore);

const props = defineProps<{ tags: Tag[] | undefined }>();

const emit = defineEmits(['update:tags']);

const tags = computed({
	get() {
		return props.tags ?? [];
	},
	set(value) {
		emit('update:tags', value);
	},
});

const remove = (tag: Tag) => {
	tags.value = tags.value.filter((t) => t.value !== tag.value);
};
</script>

<style scoped></style>
