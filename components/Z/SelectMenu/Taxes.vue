<template>
	<USelectMenu
		v-model="taxes"
		v-model:search-term="searchTerm"
		:items="items"
		:search-input="{}"
		size="md"
		multiple
		label-key="code"
		description-key="description"
		placeholder="Select Taxes"
	/>
</template>

<script lang="ts" setup>
import type { Tax } from '~/utils/types/tax';

const searchTerm = ref('');
const taxStore = useTaxStore();
const { taxes: items } = storeToRefs(taxStore);

const props = defineProps<{ taxes: Tax[] | undefined }>();

const emit = defineEmits(['update:taxes']);

onMounted(async () => {
	if (items.value.length === 0) {
		await taxStore.getTaxes();
	}
});

const taxes = computed({
	get() {
		return props.taxes ?? [];
	},
	set(value) {
		emit('update:taxes', value);
	},
});
</script>

<style scoped></style>
