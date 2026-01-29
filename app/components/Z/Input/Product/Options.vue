<template>
	<div class="space-y-4">
		<!-- Header Section -->
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">1</div>
					<h3 class="text-base font-semibold text-neutral-900">Define Product Options</h3>
				</div>
				<p class="text-xs text-neutral-500 mt-1 ml-10">Select which options to use for creating product variants</p>
			</div>
		</div>

		<!-- Options Table -->
		<div class="space-y-3">
			<!-- Info Banner -->
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
				<div class="flex items-start gap-2">
					<UIcon :name="ICONS.INFO" class="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
					<p class="text-xs text-blue-700">
						<span class="font-semibold">Tip:</span> Check the options you want to use for variant generation. Only checked options will create combinations.
					</p>
				</div>
			</div>

			<!-- Table -->
			<UTable v-model:row-selection="selectedOptions" :data="productOptions" :columns="selectable_product_option_columns">
				<template #empty-state>
					<div class="flex flex-col items-center justify-center py-12">
						<UIcon :name="ICONS.LAYERS" class="w-12 h-12 text-neutral-300 mb-3" />
						<h3 class="text-sm font-semibold text-neutral-900 mb-1">No Options Found</h3>
						<p class="text-xs text-neutral-500">Create a new option to get started</p>
					</div>
				</template>
			</UTable>

			<!-- Summary Card -->
			<div class="bg-linear-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-4">
				<div class="flex items-center gap-3">
					<UIcon :name="ICONS.CHECK_ROUNDED" class="w-5 h-5 text-primary-600 shrink-0" />
					<div class="flex-1">
						<p class="text-sm font-medium text-neutral-900">
							{{ selectedCount }} of {{ productOptions.length }} {{ productOptions.length === 1 ? 'option' : 'options' }} selected
							<span v-if="selectedCount > 0" class="text-neutral-600">
								· {{ possibleCombinations }} possible {{ possibleCombinations === 1 ? 'combination' : 'combinations' }}
							</span>
						</p>
						<p class="text-xs text-neutral-600 mt-0.5">Selected options will be used to generate product variants in the next step</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { ProductOptionInput } from '~/utils/types/product';
import { selectable_product_option_columns } from '~/utils/table-columns';

const productOptionsStore = useProductOptionStore();
const productOptions = productOptionsStore.currentProductOptions();

const props = defineProps({
	options: {
		type: Array as PropType<ProductOptionInput[]>,
		required: false,
	},
});

const emit = defineEmits(['update:productOptions']);

const selectedOptions = computed({
	get() {
		const selected: Record<number, boolean> = {};
		productOptions.forEach((option: ProductOptionInput, index: number) => {
			selected[index] = props.options?.some((propOption) => propOption.id == option.id) ?? false;
		});

		return selected;
	},
	set(value) {
		const selected: ProductOptionInput[] = [];
		productOptions.forEach((option: ProductOptionInput, index: number) => {
			if (value[index]) {
				selected.push({ ...option, metadata: undefined, values: option.values.map((value) => ({ ...value, metadata: undefined })) });
			}
		});
		emit('update:productOptions', JSON.parse(JSON.stringify(selected)));
	},
});

// Compute selected count
const selectedCount = computed(() => {
	return Object.values(selectedOptions.value).filter(Boolean).length;
});

// Calculate possible combinations
const possibleCombinations = computed(() => {
	if (selectedCount.value === 0) return 0;
	return Object.values(selectedOptions.value)
		.filter(Boolean)
		.reduce((acc, isSelected) => acc * (isSelected ? 1 : 0), 1);
});
</script>

<style scoped></style>
