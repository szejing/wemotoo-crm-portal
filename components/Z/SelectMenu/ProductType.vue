<template>
	<UFormGroup name="productTypes" class="mt-2">
		<USelectMenu v-model="productTypeId" :options="productTypes" size="md" value-attribute="id" option-attribute="value">
			<template #label>
				<span v-if="productTypeId" class="truncate">{{ productTypes.find((type) => type.id === productTypeId)?.value?.toUpperCase() }}</span>
				<span v-else class="text-gray-400">Select Type</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const productTypeStore = useProductTypeStore();
const { productTypes } = storeToRefs(productTypeStore);

const props = defineProps<{ typeId: number }>();

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

<style scoped lang="postcss"></style>
