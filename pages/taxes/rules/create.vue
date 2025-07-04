<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Add Tax Rule</h2>
		</div>
		<div class="wrapper-grid">
			<UCard>
				<template #header>
					<h2>New Tax Rule</h2>
				</template>
				<FormTaxRuleCreation
					:adding="adding"
					:new-tax-rule="new_tax_rule"
					@create-tax-rule="createTaxRule"
					@select-detail="selectRuleDetail"
					@delete-detail="deleteRuleDetail"
				/>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalTaxRuleDetail } from '#components';
import type { AmountType, FilterOperator, FilterCondition } from 'wemotoo-common';
import type { TaxRuleCreate } from '~/utils/types/form/tax/tax-rule-creation';
import type { TaxRuleDetail } from '~/utils/types/tax-rule-detail';

const modal = useModal();
const taxRuleStore = useTaxRuleStore();
const { new_tax_rule, adding } = storeToRefs(taxRuleStore);

onMounted(() => {
	taxRuleStore.resetNewTaxRule();
});

const links = [
	{
		label: 'Taxes',
		icon: ICONS.TAX,
		to: '/taxes',
	},
	{
		label: 'Tax Rules',
		to: '/taxes/rules',
	},
	{
		label: 'New Tax Rule',
		to: '/taxes/rules/create',
	},
];

const selectRuleDetail = (detail: TaxRuleDetail | undefined) => {
	modal.open(ZModalTaxRuleDetail, {
		detail,
		onUpdate: async (detail: TaxRuleDetail) => {
			new_tax_rule.value.details.push({
				description: detail.description,
				tax_code: detail.tax_code,
				tax_condition: {
					tax_code: detail.tax_condition?.tax_code ?? detail.tax_code ?? '',
					starts_at: detail.tax_condition?.starts_at ? new Date(detail.tax_condition.starts_at) : undefined,
					ends_at: detail.tax_condition?.ends_at ? new Date(detail.tax_condition.ends_at) : undefined,
					amount_type: detail.tax_condition?.amount_type as AmountType,
					rate: detail.tax_condition?.rate ?? 0,
					min_amount: detail.tax_condition?.min_amount ?? 0,
					max_amount: detail.tax_condition?.max_amount ?? 0,
					filters: [],
				},
			});

			modal.close();
		},
		onDelete: async (detail: TaxRuleDetail) => {
			// deleteRuleDetail(new_tax_rule.value.details.indexOf(detail.tax_code));
			// modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const deleteRuleDetail = (index: number) => {
	new_tax_rule.value.details.splice(index, 1);
};

const createTaxRule = async (tax_rule: TaxRuleCreate) => {
	new_tax_rule.value = {
		code: tax_rule.code,
		description: tax_rule.description,
		details: tax_rule.details.map((detail) => ({
			description: detail.description,
			tax_code: detail.tax_code ?? undefined,
			tax_condition: {
				tax_code: detail.tax_condition?.tax_code ?? '',
				starts_at: detail.tax_condition?.starts_at ?? undefined,
				ends_at: detail.tax_condition?.ends_at ?? undefined,
				amount_type: detail.tax_condition?.amount_type as AmountType,
				rate: detail.tax_condition?.rate ?? 0,
				min_amount: detail.tax_condition?.min_amount ?? 0,
				max_amount: detail.tax_condition?.max_amount ?? 0,
				filters:
					detail.tax_condition?.filters?.map((filter) => ({
						filter_operator: filter.filter_operator as FilterOperator,
						filter_condition: filter.filter_condition as FilterCondition,
						filter_value: filter.filter_value,
					})) ?? [],
			},
		})),
	};

	await taxRuleStore.createTaxRule();
	navigateTo('/taxes/rules');
};
</script>

<style scoped lang="postcss">
.wrapper-grid {
	@apply grid grid-cols-1 sm:grid-cols-2 gap-4;
}

.wrapper-stepper {
	@apply w-full;
}

.side-wrapper {
	@apply hidden sm:block col-span-1;
}

h2 {
	@apply text-secondary-600 font-normal;
}

.section-menu {
	@apply bg-white shadow-md p-2 rounded-full text-center flex justify-center items-center text-secondary-600;
}
</style>
