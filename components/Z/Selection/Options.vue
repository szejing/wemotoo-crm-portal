<template>
	<UCard>
		<template #header>
			<h1 class="text-center">Product Options</h1>
		</template>
		<div v-if="productOptions.length > 0">
			<!-- Table  -->
			<UTable v-model="selectedOptions" :rows="productOptions" :columns="product_option_columns" @select="select">
				<template #values-data="{ row }">
					<span>{{ row.values.map((v: ProductOptionValue) => v.value).join(' · ') }}</span>
				</template>
			</UTable>
		</div>

		<div v-else class="flex-center section-empty">
			<div>
				<h2>No Options Found</h2>
				<p>Create a new option to get started</p>
			</div>
		</div>

		<template #footer>
			<UButton size="md" color="primary" variant="outline" @click="updateProductOptions">Confirm</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import { product_option_columns } from '~/utils/table-columns';
import { useProductOptionsStore } from '~/stores/ProductOptions/ProductOptions';
import type { ProductOption } from '~/utils/types/product-option';
import type { ProductOptionValue } from '~/utils/types/product-option-value';

const props = defineProps({
	options: {
		type: Array as PropType<ProductOption[]>,
		required: false,
	},
});
const emit = defineEmits(['update:productOptions']);
const productOptionsStore = useProductOptionsStore();
const productOptions = productOptionsStore.currentProductOptions();

const selectedOptions = ref<ProductOption[]>([]);
selectedOptions.value = computed(() => {
	return props.options?.map((option) => ({ ...option })) ?? [];
}).value;

const select = (row: ProductOption) => {
	const index = selectedOptions.value.findIndex((item: ProductOption) => item.id === row.id);
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
