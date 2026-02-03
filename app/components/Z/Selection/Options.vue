<template>
	<UCard>
		<h1 class="text-center">{{ $t('components.selectionOptions.productOptions') }}</h1>

		<UTable v-model="selectedOptions" :data="productOptions" :columns="product_option_columns" by="name" @select="select">
			<template #values-data="{ row }">
				<span>{{ row.original.values.map((v: ProductOptionValueInput) => v.value).join(' · ') }}</span>
			</template>

			<template #empty-state>
				<div class="flex-col-center section-empty h-32">
					<h2>{{ $t('components.selectionOptions.noOptionsFound') }}</h2>
					<p>{{ $t('components.selectionOptions.createNewOptionToGetStarted') }}</p>
				</div>
			</template>
		</UTable>

		<template #footer>
			<UButton size="md" color="primary" variant="outline" @click="updateProductOptions">{{ $t('modal.confirm') }}</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import type { TableRow } from '@nuxt/ui';
import { getProductOptionColumns } from '~/utils/table-columns';
import type { ProductOptionInput, ProductOptionValueInput } from '~/utils/types/product';

const props = defineProps({
	options: {
		type: Array as PropType<ProductOptionInput[]>,
		required: false,
	},
});
const emit = defineEmits(['update:productOptions']);
const { t } = useI18n();
const product_option_columns = computed(() => getProductOptionColumns(t));

const productOptionsStore = useProductOptionStore();
const productOptions = productOptionsStore.currentProductOptions();

const selectedOptions = ref<ProductOptionInput[]>([]);
selectedOptions.value = computed(() => {
	return props.options?.map((option) => ({ ...option })) ?? [];
}).value;

const select = (e: Event, row: TableRow<ProductOptionInput>) => {
	const option = row.original;
	if (!option) return;

	const index = selectedOptions.value.findIndex((item: ProductOptionInput) => item.id === option.id);
	if (index === -1) {
		selectedOptions.value.push({ ...option });
	} else {
		selectedOptions.value.splice(index, 1);
	}
};

const updateProductOptions = () => {
	emit('update:productOptions', selectedOptions.value);
};
</script>

<style scoped></style>
