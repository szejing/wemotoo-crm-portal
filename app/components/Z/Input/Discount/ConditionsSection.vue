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
					<UFormField :label="$t('components.discountForm.minAmount')" :name="fieldName(`conditions.${index}.min_amount`)">
						<UInput v-model.number="cond.min_amount" type="number" min="0" step="0.01">
							<template #leading>
								<span class="text-muted text-sm tabular-nums select-none">{{ ruleValueCurrencyCode }}</span>
							</template>
						</UInput>
					</UFormField>
					<UFormField :label="$t('components.discountForm.maxAmount')" :name="fieldName(`conditions.${index}.max_amount`)">
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
						<UFormField :label="$t('components.discountForm.filterOperator')" :name="fieldName(`conditions.${index}.filter_operator`)">
							<ZSelectMenuDiscountFilterOperator v-model="cond.filter_operator" />
						</UFormField>
						<UFormField :label="$t('components.discountForm.filterCondition')" :name="fieldName(`conditions.${index}.filter_condition`)">
							<ZSelectMenuDiscountFilterCondition v-model="cond.filter_condition" @update:model-value="onFilterConditionChange(cond)" />
						</UFormField>
						<UFormField :label="$t('components.discountForm.filterValue')" :name="fieldName(`conditions.${index}.filter_value`)">
							<ZInputDiscountFilterValuePicker v-model="cond.filter_value" :filter-condition="cond.filter_condition" />
						</UFormField>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { CreateDiscountConditionReq } from '~/repository/modules/discount/models/request/create-discount.req';
import type { DiscountCreate } from '~/utils/types/form/discount-creation';
import { ICONS } from '~/utils/icons';

const props = withDefaults(
	defineProps<{
		state: DiscountCreate;
		/** Dot-prefix for UFormField names (e.g. `discount` → `discount.conditions.0.min_amount`). */
		formFieldPrefix?: string;
	}>(),
	{ formFieldPrefix: '' },
);

const state = toRef(props, 'state');

const fieldName = (suffix: string) => (props.formFieldPrefix ? `${props.formFieldPrefix}.${suffix}` : suffix);

/** Hardcoded until merchant currency is wired into this form. */
const ruleValueCurrencyCode = 'RM';

const emptyCondition = (): CreateDiscountConditionReq => {
	return {
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

const onFilterConditionChange = (condition: CreateDiscountConditionReq) => {
	condition.filter_value = '';
};
</script>
