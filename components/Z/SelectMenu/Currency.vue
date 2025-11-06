<template>
	<USelectMenu
		v-model="currency"
		v-model:search-term="searchTerm"
		:items="items"
		:search-input="{}"
		size="md"
		label-key="code"
		description-key="name"
		:disabled="items.length == 1"
		placeholder="Select Currency"
	/>
</template>

<script lang="ts" setup>
const searchTerm = ref('');
const merchantInfoStore = useMerchantInfoStore();
const { currencies: items } = storeToRefs(merchantInfoStore);

const props = defineProps<{ currencyCode: string | undefined }>();

const emit = defineEmits(['update:currency']);

const currency = computed({
	get() {
		return items.value.find((currency) => currency.code === props.currencyCode);
	},
	set(value) {
		emit('update:currency', value);
	},
});
</script>

<style scoped></style>
