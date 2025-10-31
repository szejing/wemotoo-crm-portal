<template>
	<UFormField name="tags" class="mt-2">
		<USelectMenu v-model="tax_rule" v-model:search-term="searchTerm" :items="taxRuleItems" :search-input="{}" size="md" value-key="code">
			<template #default>
				<span v-if="tax_rule" class="truncate">{{ tax_rule.code }}</span>
				<span v-else class="text-neutral-400">Select Tax Rule</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import type { TaxRule, TaxRuleInput } from '~/utils/types/tax-rule';

const searchTerm = ref('');
const taxRuleStore = useTaxRuleStore();
const { tax_rules: tax_rules_options } = storeToRefs(taxRuleStore);

const taxRuleItems = computed(() => {
	return tax_rules_options.value.map((taxRule) => ({
		...taxRule,
		label: taxRule.code,
	}));
});

const props = defineProps<{ taxRule: TaxRule | TaxRuleInput | string | undefined }>();

const emit = defineEmits(['update:taxRule']);

onMounted(async () => {
	if (tax_rules_options.value.length === 0) {
		await taxRuleStore.getTaxRules();
	}
});

const tax_rule = computed({
	get() {
		if (typeof props.taxRule === 'string') {
			return tax_rules_options.value.find((tax_rule) => tax_rule.code === props.taxRule);
		}

		return props.taxRule ?? undefined;
	},
	set(value) {
		emit('update:taxRule', value);
	},
});
</script>

<style scoped></style>
