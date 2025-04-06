<template>
	<UFormGroup name="currencies" class="mt-2">
		<USelectMenu
			v-model="currency_code"
			v-model:query="query"
			:items="currencies"
			searchable
			size="md"
			value-attribute="code"
			option-attribute="code"
			:disabled="currencies.length == 1"
		>
			<template #label>
				<span v-if="currency_code" class="truncate">{{ currency_code }}</span>
				<span v-else class="text-neutral-400">Select Currency</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const query = ref('');
const merchantInfoStore = useMerchantInfoStore();
const { currencies } = storeToRefs(merchantInfoStore);

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

<style scoped lang="postcss"></style>
