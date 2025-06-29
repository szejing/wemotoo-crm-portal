<template>
	<div>
		<UForm :schema="CreateTaxRuleValidation" :state="new_tax_rule" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputTaxRuleGeneralInfo v-model:code="new_tax_rule.code" v-model:description="new_tax_rule.description" />

			<!-- *********************** Details *********************** -->

			<div class="flex items-center justify-between mt-6">
				<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rule Details</h3>
				<UButton size="sm" color="green" variant="ghost" @click="addDetail">Add rule detail +</UButton>
			</div>

			<div v-if="new_tax_rule.details && new_tax_rule.details.length > 0" class="space-y-3 mt-4">
				<div class="space-y-2">
					<div
						v-for="(detail, index) in new_tax_rule.details"
						:key="index"
						class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						<div class="flex-1 min-w-0">
							<div class="flex items-center space-x-4">
								<p class="text-sm font-medium text-gray-900 dark:text-white truncate">
									{{ detail.tax_code ?? 'No tax code' }}
								</p>

								<UBadge v-if="detail.tax_condition?.amount_type" :label="`${detail.tax_condition.amount_type}`" size="xs" color="blue" variant="soft" />
								<UBadge v-if="detail.tax_condition?.rate" :label="`${detail.tax_condition.rate}%`" size="xs" color="green" variant="soft" />
								<UBadge v-if="detail.tax_condition?.min_amount" :label="`Min: ${detail.tax_condition.min_amount}`" size="xs" color="gray" variant="soft" />
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 truncate">
								{{ detail.description || 'No description' }}
							</p>
							<div class="flex items-center space-x-2">
								<p v-if="detail.tax_condition?.starts_at" class="text-xs text-gray-500 dark:text-gray-400 truncate">
									Starts At: {{ getFormattedDate(detail.tax_condition?.starts_at, 'dd MMM yyyy') }}
								</p>
								<p v-if="detail.tax_condition?.ends_at" class="text-xs text-gray-500 dark:text-gray-400 truncate">
									Ends At: {{ getFormattedDate(detail.tax_condition?.ends_at, 'dd MMM yyyy') }}
								</p>
							</div>
						</div>
						<UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost" @click="deleteDetail(index)" />
					</div>
				</div>
			</div>

			<!-- Empty state when no details -->
			<div v-else class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
				<div class="max-w-sm mx-auto">
					<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No tax rule details</h3>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first tax rule detail.</p>
				</div>
			</div>

			<!-- *********************** Details *********************** -->

			<!-- *********************** General Info *********************** -->
			<div class="flex-center text-center mt-3">
				<UButton size="md" color="green" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateTaxRuleValidation } from '~/utils/schema';
import { getFormattedDate, type AmountType, type FilterCondition, type FilterOperator } from 'wemotoo-common';
import { ZModalTaxRuleDetail } from '#components';
import type { TaxRuleDetail } from '~/utils/types/tax-rule-detail';

type Schema = z.output<typeof CreateTaxRuleValidation>;

const modal = useModal();
const taxRuleStore = useTaxRuleStore();
const { adding, new_tax_rule } = storeToRefs(taxRuleStore);

onMounted(() => {
	taxRuleStore.resetNewTaxRule();
});

const addDetail = () => {
	modal.open(ZModalTaxRuleDetail, {
		detail: undefined,
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
			// await taxRuleStore.deleteTaxRuleDetail(detail.tax_code);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const deleteDetail = (index: number) => {
	new_tax_rule.value.details.splice(index, 1);
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, details } = event.data;

	new_tax_rule.value = {
		code,
		description,
		details: details.map((detail) => ({
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

<style></style>
