<template>
	<div class="space-y-2">
		<h3>Options</h3>

		<!-- ************* MOBILE ************* -->
		<div v-for="(option, index) in productOptions" :key="index" class="flex flex-col sm:hidden gap-4">
			<div class="flex-jbetween-icenter gap-2">
				<UInput v-model="option.name" placeholder="Name" class="w-52" />
				<UButton
					variant="outline"
					class="flex-none"
					square
					icon="i-material-symbols-delete-outline-rounded"
					size="sm"
					color="danger"
					@click="() => removeOption(index)"
				/>
			</div>
			<ZInputTags v-model="option.values" placeholder="Values" class="flex-1" />
		</div>
		<!-- ************* MOBILE ************* -->

		<!-- ************* DESKTOP ************* -->
		<div v-for="(option, index) in productOptions" :key="index" class="hidden sm:flex gap-4">
			<UInput v-model="option.name" placeholder="Name" class="w-36" />
			<ZInputTags v-model="option.values" placeholder="Values" class="flex-1" />
			<UButton
				variant="outline"
				class="flex-none"
				square
				icon="i-material-symbols-delete-outline-rounded"
				size="sm"
				color="danger"
				@click="() => removeOption(index)"
			/>
		</div>
		<!-- ************* DESKTOP ************* -->

		<UButton color="primary" block variant="outline" @click="addOption">Add Option</UButton>
	</div>
</template>

<script lang="ts" setup>
import type { ProductOption } from '~/utils/types/product-option';

const props = defineProps<{ options: ProductOption[] | undefined }>();
const emit = defineEmits(['update:productOption']);

const productOptions = computed({
	get() {
		return props.options ?? [];
	},
	set(value) {
		emit('update:productOption', value);
	},
});

const removeOption = (index: number) => {
	productOptions.value = productOptions.value.filter((_, i) => i !== index);
};

const addOption = () => {
	productOptions.value = [
		...productOptions.value,
		{
			name: '',
			values: [],
		},
	];
};
</script>

<style scoped lang="css"></style>
