<template>
	<div class="space-y-2">
		<div class="flex-jbetween-icenter">
			<h3>Options</h3>
			<UButton color="primary" variant="outline" @click="isOptionSelectionModal = true">Add Option</UButton>
		</div>

		<!-- ************* MOBILE ************* -->
		<div v-for="(option, index) in prodOptions" :key="index" class="flex flex-col sm:hidden">
			<div class="flex-jbetween-icenter gap-2 mt-4">
				<UInput v-model="option.name" disabled placeholder="Name" class="w-52" />
				<UButton variant="outline" class="flex-none" square :icon="ICONS.TRASH" size="sm" color="danger" @click="() => removeOption(index)" />
			</div>
			<InputTags v-model="option.values" placeholder="Values" class="flex-1 mt-2" />
		</div>
		<!-- ************* MOBILE ************* -->

		<!-- ************* DESKTOP ************* -->
		<div v-for="(option, index) in prodOptions" :key="index" class="hidden sm:flex">
			<div class="w-full flex mt-2 gap-4">
				<UInput v-model="option.name" disabled placeholder="Name" class="w-36" />
				<InputTags v-model="option.values" placeholder="Values" class="flex-1" />

				<UButton variant="outline" class="flex-none" square :icon="ICONS.TRASH" size="sm" color="danger" @click="() => removeOption(index)" />
			</div>
		</div>
		<!-- ************* DESKTOP ************* -->

		<UModal v-model="isOptionSelectionModal">
			<ZSelectionOptions :options="prodOptions" @update:product-options="updateProductOptions" />
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import type { ProductOption } from '~/utils/types/product-option';

const isOptionSelectionModal = ref(false);

const props = defineProps({
	options: {
		type: Array as PropType<ProductOption[]>,
		required: false,
	},
});

const emit = defineEmits(['update:productOptions']);

const prodOptions = computed({
	get() {
		return props.options ?? [];
	},
	set(value) {
		emit('update:productOptions', value);
	},
});

const removeOption = (index: number) => {
	prodOptions.value = prodOptions.value.filter((_, i) => i !== index);
};

const updateProductOptions = (options: ProductOption[]) => {
	prodOptions.value = options;
	isOptionSelectionModal.value = false;
};
</script>

<style scoped lang="css"></style>
