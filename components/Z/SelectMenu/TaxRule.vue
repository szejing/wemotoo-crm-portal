<template>
	<UFormGroup name="tags" class="mt-2">
		<USelectMenu v-model="tax_rule" v-model:query="query" :options="tax_rules_options" searchable size="md" option-attribute="code" by="code">
			<template #label>
				<span v-if="tax_rule" class="truncate">{{ tax_rule.code }}</span>
				<span v-else class="text-gray-400">Select Tax Rule</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { TaxRule, TaxRuleInput } from '~/utils/types/tax-rule';

const query = ref('');
const taxRuleStore = useTaxRuleStore();
const { tax_rules: tax_rules_options } = storeToRefs(taxRuleStore);

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

<style scoped lang="postcss"></style>
