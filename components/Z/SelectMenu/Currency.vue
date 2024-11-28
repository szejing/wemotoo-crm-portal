<template>
	<UFormGroup name="currencies" class="mt-2">
		<USelectMenu
			v-model="currency"
			v-model:query="query"
			:options="currencies"
			searchable
			size="md"
			value-attribute="code"
			option-attribute="code"
			:disabled="currencies.length == 1"
		>
			<template #label>
				<span v-if="currency" class="truncate">{{ currency }}</span>
				<span v-else class="text-gray-400">Select Currency</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
const query = ref('');
const merchantInfoStore = useMerchantInfoStore();
const { currencies } = storeToRefs(merchantInfoStore);

const props = defineProps<{ currency: string | undefined }>();

const emit = defineEmits(['update:currency']);

const currency = computed({
	get() {
		return props.currency ?? undefined;
	},
	set(value) {
		emit('update:currency', value);
	},
});
</script>

<style></style>
