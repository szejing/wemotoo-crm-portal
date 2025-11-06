<template>
	<USelectMenu
		v-model="brands"
		v-model:search-term="searchTerm"
		:items="items"
		:search-input="{}"
		size="md"
		multiple
		label-key="code"
		description-key="description"
		placeholder="Select Brands"
	>
		<template #empty>
			<UButton color="success" variant="ghost">Create "{{ searchTerm }}"</UButton>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { Brand } from '~/utils/types/brand';

const searchTerm = ref('');
const brandStore = useBrandStore();
const { brands: items } = storeToRefs(brandStore);

const props = defineProps<{ brands: Brand[] | undefined }>();

const emit = defineEmits(['update:brands']);

const brands = computed<Brand[]>({
	get() {
		return props.brands ?? [];
	},
	set(value) {
		emit('update:brands', JSON.parse(JSON.stringify(value)));
	},
});
</script>

<style scoped></style>
