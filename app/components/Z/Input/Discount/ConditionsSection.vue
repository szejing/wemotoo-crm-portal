<template>
	<UCard id="section-discount-conditions" class="shadow-md scroll-mt-4">
		<template #header>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-6 h-6" />
					<h2 class="text-xl font-semibold">{{ $t('components.discountForm.conditionsSection') }}</h2>
				</div>
				<UButton color="primary" variant="soft" size="sm" icon="i-lucide-plus" @click="addCondition">
					{{ $t('components.discountForm.addCondition') }}
				</UButton>
			</div>
			<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1 px-0">{{ $t('components.discountForm.conditionsHelp') }}</p>
		</template>

		<div v-if="!state.conditions?.length" class="py-6 px-4 text-sm text-muted">
			{{ $t('components.discountForm.noConditions') }}
		</div>

		<div v-else class="space-y-6 py-2 px-4">
			<div v-for="(cond, index) in state.conditions" :key="index" class="space-y-4">
				<div class="flex items-center justify-between gap-2">
					<span class="text-sm font-medium text-highlighted">{{ $t('components.discountForm.conditionRow', { n: index + 1 }) }}</span>
					<UButton color="error" variant="ghost" size="xs" icon="i-lucide-trash-2" :label="$t('common.delete')" @click="removeCondition(index)" />
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<UFormField :label="$t('components.discountForm.conditionOperator')" :name="`conditions.${index}.operator`" required>
						<USelect
							:model-value="cond.operator"
							:items="conditionOperatorItems"
							value-attribute="value"
							class="w-full"
							@update:model-value="(v: DiscountConditionOperator) => (cond.operator = v)"
						/>
					</UFormField>
					<UFormField :label="$t('components.discountForm.conditionType')" :name="`conditions.${index}.type`" required>
						<USelect
							:model-value="cond.type"
							:items="conditionTypeItems"
							value-attribute="value"
							class="w-full"
							@update:model-value="(v: DiscountConditionType) => (cond.type = v)"
						/>
					</UFormField>
					<UFormField :label="$t('components.discountForm.minAmount')" :name="`conditions.${index}.min_amount`">
						<UInput v-model.number="cond.min_amount" type="number" min="0" step="0.01">
							<template #leading>
								<span class="text-muted text-sm tabular-nums select-none">{{ ruleValueCurrencyCode }}</span>
							</template>
						</UInput>
					</UFormField>
					<UFormField :label="$t('components.discountForm.maxAmount')" :name="`conditions.${index}.max_amount`">
						<UInput v-model.number="cond.max_amount" type="number" min="0" step="0.01">
							<template #leading>
								<span class="text-muted text-sm tabular-nums select-none">{{ ruleValueCurrencyCode }}</span>
							</template>
						</UInput>
					</UFormField>
				</div>
				<div class="border-t border-default pt-4 space-y-4">
					<p class="text-xs font-medium uppercase tracking-wide text-muted">{{ $t('components.discountForm.filterOptional') }}</p>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<UFormField :label="$t('components.discountForm.filterOperator')" :name="`conditions.${index}.filter_operator`">
							<USelect
								:model-value="cond.filter_operator ?? selectNoneValue"
								:items="filterOperatorItems"
								value-attribute="value"
								class="w-full"
								@update:model-value="(v) => (cond.filter_operator = v === selectNoneValue ? undefined : (v as FilterOperator))"
							/>
						</UFormField>
						<UFormField :label="$t('components.discountForm.filterCondition')" :name="`conditions.${index}.filter_condition`">
							<USelect
								:model-value="cond.filter_condition ?? selectNoneValue"
								:items="filterConditionItems"
								value-attribute="value"
								class="w-full"
								@update:model-value="(v) => (cond.filter_condition = v === selectNoneValue ? undefined : (v as FilterCondition))"
							/>
						</UFormField>
						<UFormField :label="$t('components.discountForm.filterValue')" :name="`conditions.${index}.filter_value`">
							<UInput v-model="cond.filter_value" />
						</UFormField>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import { DiscountConditionOperator, DiscountConditionType, FilterCondition, FilterOperator } from 'wemotoo-common';
import type { CreateDiscountConditionReq } from '~/repository/modules/discount/models/request/create-discount.req';
import type { DiscountCreate } from '~/utils/types/form/discount-creation';
import { ICONS } from '~/utils/icons';

const props = defineProps<{
	state: DiscountCreate;
}>();

const { t } = useI18n();
const state = toRef(props, 'state');

/** USelect reserves `''` for clearing; optional rows use this sentinel instead. */
const selectNoneValue = '__none__' as const;

/** Hardcoded until merchant currency is wired into this form. */
const ruleValueCurrencyCode = 'RM';

const humanizeEnum = (value: string) => {
	return value
		.split('_')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(' ');
};

const conditionOperatorItems = computed(() => Object.values(DiscountConditionOperator).map((v) => ({ label: humanizeEnum(v), value: v })));

const conditionTypeItems = computed(() => Object.values(DiscountConditionType).map((v) => ({ label: humanizeEnum(v), value: v })));

const filterOperatorItems = computed(() => [
	{ label: t('components.discountForm.filterNone'), value: selectNoneValue },
	...Object.values(FilterOperator).map((v) => ({ label: humanizeEnum(v), value: v })),
]);

const filterConditionItems = computed(() => [
	{ label: t('components.discountForm.filterNone'), value: selectNoneValue },
	...Object.values(FilterCondition).map((v) => ({ label: humanizeEnum(v), value: v })),
]);

const emptyCondition = (): CreateDiscountConditionReq => {
	return {
		operator: DiscountConditionOperator.IN,
		type: DiscountConditionType.PRODUCTS,
		min_amount: undefined,
		max_amount: undefined,
		filter_operator: undefined,
		filter_condition: undefined,
		filter_value: '',
	};
};

const addCondition = () => {
	const list = state.value.conditions ?? [];
	state.value.conditions = [...list, emptyCondition()];
};

const removeCondition = (index: number) => {
	const list = [...(state.value.conditions ?? [])];
	list.splice(index, 1);
	state.value.conditions = list;
};
</script>
