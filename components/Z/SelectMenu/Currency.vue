<template>
	<USelectMenu
		v-model="currency_code"
		v-model:search-term="searchTerm"
		:items="currencyItems"
		:search-input="{}"
		size="md"
		value-key="code"
		:disabled="currencies.length == 1"
	>
		<template #default>
			<span v-if="currency_code" class="truncate">{{ currency_code }}</span>
			<span v-else class="text-neutral-400">Select Currency</span>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
const searchTerm = ref('');
const merchantInfoStore = useMerchantInfoStore();
const { currencies } = storeToRefs(merchantInfoStore);

const currencyItems = computed(() => {
	return currencies.value.map((currency) => ({
		...currency,
		label: currency.code,
	}));
});

const props = defineProps<{ currencyCode: string | undefined }>();

const emit = defineEmits(['update:currencyCode']);

const currency_code = computed({
	get() {
		return props.currencyCode ?? undefined;
	},
	set(value) {
		emit('update:currencyCode', value);
	},
});
</script>

<style scoped></style>
