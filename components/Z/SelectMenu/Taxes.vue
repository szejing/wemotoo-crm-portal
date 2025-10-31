<template>
	<UFormField name="tags" class="mt-2">
		<USelectMenu v-model="taxes" v-model:search-term="searchTerm" :items="taxItems" :search-input="{}" size="md" value-key="code" multiple>
			<template #default>
				<span v-if="taxes.length" class="truncate">{{ taxes.map((tax: Tax) => tax.code).join(', ') }}</span>
				<span v-else class="text-neutral-400">Select Taxes</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import type { Tax } from '~/utils/types/tax';

const searchTerm = ref('');
const taxStore = useTaxStore();
const { taxes: tax_options } = storeToRefs(taxStore);

const taxItems = computed(() => {
	return tax_options.value.map((tax) => ({
		...tax,
		label: tax.code,
	}));
});

const props = defineProps<{ taxes: Tax[] | undefined }>();

const emit = defineEmits(['update:taxes']);

onMounted(async () => {
	if (tax_options.value.length === 0) {
		await taxStore.getTaxes();
	}
});

const taxes = computed({
	get() {
		return props.taxes ?? [];
	},
	set(value) {
		emit('update:taxes', value);
	},
});
</script>

<style scoped></style>
