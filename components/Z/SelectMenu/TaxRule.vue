<template>
	<USelectMenu
		v-model="tax_rule"
		v-model:search-term="searchTerm"
		:items="items"
		:search-input="{}"
		size="md"
		label-key="code"
		description-key="description"
		placeholder="Select Tax Rule"
	/>
</template>

<script lang="ts" setup>
import type { TaxRule } from '~/utils/types/tax-rule';

const searchTerm = ref('');
const taxRuleStore = useTaxRuleStore();
const { tax_rules: items } = storeToRefs(taxRuleStore);

const props = defineProps<{ taxRule: TaxRule | string | undefined }>();

const emit = defineEmits(['update:taxRule']);

onMounted(async () => {
	if (items.value.length === 0) {
		await taxRuleStore.getTaxRules();
	}
});

const tax_rule = computed({
	get() {
		if (typeof props.taxRule === 'string') {
			return items.value.find((tax_rule) => tax_rule.code === props.taxRule);
		}

		return props.taxRule ?? undefined;
	},
	set(value) {
		emit('update:taxRule', value);
	},
});
</script>

<style scoped></style>
