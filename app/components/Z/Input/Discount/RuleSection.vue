<template>
	<UCard id="section-discount-rule" class="shadow-md scroll-mt-4">
		<template #header>
			<div class="flex items-center gap-2">
				<UIcon :name="ICONS.INFO" class="text-primary-500 w-6 h-6" />
				<h2 class="text-xl font-semibold">{{ $t('components.discountForm.ruleSection') }}</h2>
				<span class="text-red-500 text-sm">*</span>
			</div>
		</template>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 px-4">
			<UFormField :label="$t('components.discountForm.ruleType')" :name="fieldName('rule_type')" required>
				<USelect :model-value="state.rule_type" :items="ruleTypeItems" value-attribute="value" class="w-full" @update:model-value="onRuleTypeSelect" />
			</UFormField>
			<UFormField v-if="state.rule_type !== DiscountRuleType.FREE_SHIPPING" :label="$t('components.discountForm.ruleValue')" :name="fieldName('rule_value')" required>
				<UInput v-model.number="state.rule_value" type="number" min="0" :max="state.rule_type === DiscountRuleType.PERCENTAGE ? 100 : undefined" step="0.01">
					<template #trailing>
						<span class="text-muted text-sm pe-2 tabular-nums">{{ ruleValueSuffix }}</span>
					</template>
				</UInput>
				<p v-if="state.rule_type === DiscountRuleType.PERCENTAGE" class="text-xs text-muted mt-1">
					{{ $t('components.discountForm.ruleValuePercentHint') }}
				</p>
			</UFormField>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 px-4">
			<UFormField :label="$t('components.discountForm.usageLimit')" :name="fieldName('usage_limit')">
				<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.usageLimitHint') }}</p>
				<UInput v-model.number="usageLimitModel" type="number" min="1" :placeholder="$t('components.discountForm.usageLimitPlaceholder')" />
			</UFormField>
			<UFormField :label="$t('components.discountForm.allocation')" :name="fieldName('allocation')">
				<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.allocationHint') }}</p>
				<USelect v-model="state.allocation" :items="allocationItems" value-attribute="value" class="w-full max-w-md" />
			</UFormField>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import { AllocationType, DiscountRuleType } from 'wemotoo-common';
import type { DiscountCreate } from '~/utils/types/form/discount-creation';
import { ICONS } from '~/utils/icons';

const props = withDefaults(
	defineProps<{
		state: DiscountCreate;
		/** Dot-prefix for UFormField names (e.g. `discount` → `discount.rule_type`). */
		formFieldPrefix?: string;
	}>(),
	{ formFieldPrefix: '' },
);

const { t } = useI18n();
const state = toRef(props, 'state');

const fieldName = (segment: string) => (props.formFieldPrefix ? `${props.formFieldPrefix}.${segment}` : segment);

/** Hardcoded until merchant currency is wired into this form. */
const ruleValueCurrencyCode = 'RM';

const humanizeEnum = (value: string) => {
	return value
		.split('_')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(' ');
};

const ruleTypeLabel = (rt: DiscountRuleType) =>
	t(
		{
			[DiscountRuleType.FIXED]: 'components.discountForm.ruleTypeOptionFixed',
			[DiscountRuleType.PERCENTAGE]: 'components.discountForm.ruleTypeOptionPercentage',
			[DiscountRuleType.FREE_SHIPPING]: 'components.discountForm.ruleTypeOptionFreeShipping',
		}[rt],
	);

const ruleTypeItems = computed(() => Object.values(DiscountRuleType).map((v) => ({ label: ruleTypeLabel(v), value: v })));

const ruleValueSuffix = computed(() => {
	const rt = state.value.rule_type;
	if (rt === DiscountRuleType.FIXED) return ruleValueCurrencyCode;
	if (rt === DiscountRuleType.PERCENTAGE) return '%';
	return '';
});

const onRuleTypeSelect = (v: DiscountRuleType) => {
	const prev = state.value.rule_type;
	state.value.rule_type = v;
	if (v === DiscountRuleType.FREE_SHIPPING) {
		state.value.rule_value = 0;
	} else if (prev === DiscountRuleType.FREE_SHIPPING) {
		const rv = state.value.rule_value ?? 0;
		if (v === DiscountRuleType.PERCENTAGE && (rv <= 0 || rv > 100)) {
			state.value.rule_value = 10;
		} else if (v === DiscountRuleType.FIXED && rv <= 0) {
			state.value.rule_value = 1;
		}
	}
};

const allocationItems = computed(() => Object.values(AllocationType).map((v) => ({ label: humanizeEnum(v), value: v })));

const usageLimitModel = computed({
	get() {
		return state.value.usage_limit ?? '';
	},
	set(v: number | string) {
		if (v === '' || v === null || v === undefined) {
			state.value.usage_limit = undefined;
			return;
		}
		const n = typeof v === 'number' ? v : Number(v);
		state.value.usage_limit = Number.isNaN(n) ? undefined : n;
	},
});
</script>
