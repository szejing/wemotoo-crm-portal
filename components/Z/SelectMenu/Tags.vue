<template>
	<USelectMenu v-model="tags" v-model:search-term="searchTerm" :items="items" :search-input="{}" size="md" multiple label-key="value" placeholder="Select Tags">
		<template #empty>
			<UButton color="success" variant="ghost">Create "{{ searchTerm }}"</UButton>
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
</script>

<style scoped></style>
