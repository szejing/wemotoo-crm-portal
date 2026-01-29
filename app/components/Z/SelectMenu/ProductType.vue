<template>
	<USelectMenu
		v-model="productTypeId"
		:items="items"
		size="md"
		value-key="id"
		label-key="value"
		description-key="value"
		placeholder="Select Type"
		:ui="{
			item: 'font-semibold text-highlighted capitalize',
			value: 'capitalize',
		}"
	/>
</template>

<script lang="ts" setup>
const productTypeStore = useProductTypeStore();
const { prod_types: items } = storeToRefs(productTypeStore);

const props = defineProps<{ typeId: number | undefined }>();

const emit = defineEmits(['update:typeId']);

const productTypeId = computed({
	get() {
		return props.typeId;
	},
	set(value) {
		emit('update:typeId', value);
	},
});
</script>

<style scoped></style>
