<template>
	<USelectMenu
		v-model="codeModel"
		v-model:search-term="searchTerm"
		:items="items"
		value-key="code"
		label-key="searchText"
		:search-input="{
			placeholder: $t('components.selectMenu.searchDiscount'),
			icon: 'i-lucide-search',
		}"
		size="md"
		variant="formTrigger"
		:placeholder="placeholder ?? $t('components.selectMenu.selectDiscount')"
		:loading="loading"
		class="w-full"
	>
		<template #default>
			<ZSelectMenuDiscountRow :row="selected" :none-label="noneLabel" compact />
		</template>

		<template #item="{ item }">
			<ZSelectMenuDiscountRow :row="item" :none-label="noneLabel" />
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import { DiscountRuleType } from 'wemotoo-common';
import type { Discount } from '~/utils/types/discount';
import type { DiscountSelectMenuRow } from '~/utils/types/discount-select-menu';
import { formatDiscountRuleValue } from '~/utils/discount-rule-display';

const RULE_TYPE_I18N: Record<DiscountRuleType, string> = {
	[DiscountRuleType.PERCENTAGE]: 'components.discountForm.ruleTypeOptionPercentage',
	[DiscountRuleType.FIXED]: 'components.discountForm.ruleTypeOptionFixed',
	[DiscountRuleType.FREE_SHIPPING]: 'components.discountForm.ruleTypeOptionFreeShipping',
};

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		modelValue: string;
		discounts: Discount[];
		noneLabel: string;
		noneValue?: string;
		loading?: boolean;
		placeholder?: string;
	}>(),
	{
		noneValue: '__none__',
		loading: false,
	},
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const searchTerm = ref('');

function ruleTypeLabel(rt: DiscountRuleType): string {
	return t(RULE_TYPE_I18N[rt]);
}

const items = computed<DiscountSelectMenuRow[]>(() => {
	const discountRows = props.discounts.map((d) => {
		const typeLabel = ruleTypeLabel(d.rule_type);
		const valuePart =
			d.rule_type === DiscountRuleType.FREE_SHIPPING ? '' : `${formatDiscountRuleValue(d.rule_type, d.rule_value)} `;
		const searchText = [d.code, d.description, typeLabel, valuePart, props.noneValue].filter(Boolean).join(' ').trim();
		return {
			code: d.code,
			isNone: false,
			description: d.description ?? '',
			rule_type: d.rule_type,
			rule_value: d.rule_value,
			searchText,
		};
	});

	const noneSearch = [props.noneLabel, props.noneValue].join(' ');

	return [
		{
			code: props.noneValue,
			isNone: true,
			description: '',
			rule_type: null,
			rule_value: 0,
			searchText: noneSearch,
		},
		...discountRows,
	];
});

const selected = computed<DiscountSelectMenuRow>(() => {
	const list = items.value;
	return list.find((i) => i.code === props.modelValue) ?? list[0]!;
});

const codeModel = computed({
	get() {
		return props.modelValue;
	},
	set(v: string | undefined) {
		emit('update:modelValue', v ?? props.noneValue);
	},
});
</script>
