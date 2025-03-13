<template>
	<UCard>
		<h1 class="text-center">Product Options</h1>

		<UTable v-model="selectedOptions" :rows="productOptions" :columns="product_option_columns" by="name" @select="select">
			<template #values-data="{ row }">
				<span>{{ row.values.map((v: ProdOptionValuesInput) => v.value).join(' · ') }}</span>
			</template>

			<template #empty-state>
				<div class="flex-col-center section-empty h-32">
					<h2>No Options Found</h2>
					<p>Create a new option to get started</p>
				</div>
			</template>
		</UTable>

		<template #footer>
			<UButton size="md" color="primary" variant="outline" @click="updateProductOptions">Confirm</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import { product_option_columns } from '~/utils/table-columns';
import { useProductOptionsStore } from '~/stores/ProductOptions/ProductOptions';
import type { ProdOptionInput, ProdOptionValuesInput } from '~/utils/types/product';

const props = defineProps({
	items: {
		type: Array as PropType<ProdOptionInput[]>,
		required: false,
	},
});
const emit = defineEmits(['update:productOptions']);
const productOptionsStore = useProductOptionsStore();
const productOptions = productOptionsStore.currentProductOptions();

const selectedOptions = ref<ProdOptionInput[]>([]);
selectedOptions.value = computed(() => {
	return props.items?.map((option) => ({ ...option })) ?? [];
}).value;

const select = (row: ProdOptionInput) => {
	const index = selectedOptions.value.findIndex((item: ProdOptionInput) => item.id === row.id);
	if (index === -1) {
		selectedOptions.value.push(row);
	} else {
		selectedOptions.value.splice(index, 1);
	}
};

const updateProductOptions = () => {
	emit('update:productOptions', selectedOptions.value);
};
</script>

<style></style>
