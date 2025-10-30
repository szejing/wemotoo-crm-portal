<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="page_size" :items="options_page_size" /> </span>

					<div class="flex gap-4">
						<UButton color="success" @click="navigateTo('/taxes/rules/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>
				<!-- Table  -->
				<UTable :data="rows" :columns="tax_rule_columns" :loading="loading" @select-row="selectTaxRule">
					<template #code-data="{ row }">
						<div class="flex-col-start">
							<h3 class="text-neutral-800 font-bold">{{ row.code }}</h3>
							<h5 class="text-neutral-400">{{ row.description }}</h5>
						</div>
					</template>

					<template #details-data="{ row }">
						<div class="flex-col-start text-neutral-700 space-y-3">
							<div v-if="row.details && row.details.length > 0" class="space-y-3">
								<div v-for="(detail, index) in row.details" :key="index" class="text-sm">
									<div class="border-l-2 border-neutral-300 pl-2 space-y-1">
										<h4 class="text-neutral-800 font-bold">{{ detail.tax?.description || detail.description }}</h4>
										<div v-if="detail.tax_condition" class="flex items-center gap-2 mt-2">
											<UBadge :label="getAmountTypeLabel(detail.tax_condition.amount_type)" variant="soft" size="md" />
											<UBadge :label="`${detail.tax_condition.rate * 100}%`" variant="soft" color="success" size="md" />
										</div>
									</div>
								</div>
							</div>
							<div v-else class="text-xs text-neutral-400">No details configured</div>
						</div>
					</template>

					<template #empty-state>
						<div class="flex-col-center section-empty">
							<h2>No tax code Found</h2>
							<p>Create a new tax code to get started</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="tax_rules.length > 0" class="section-pagination">
					<UPagination v-model="current_page" :page-count="page_size" :total="total_tax_rules" @update:model-value="updatePage" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { tax_rule_columns } from '~/utils/table-columns';
import type { TaxRule } from '~/utils/types/tax-rule';

const links = [
	{
		label: 'Taxes',
		icon: ICONS.TAX,
		to: '/taxes',
	},
	{
		label: 'All Tax Rules',
		icon: ICONS.LIST,
		to: '/taxes/rules',
	},
];

const taxRuleStore = useTaxRuleStore();

useHead({ title: 'Wemotoo CRM - Tax Rules' });

onMounted(async () => {
	await taxRuleStore.getTaxRules();
});

const { loading, tax_rules, page_size, current_page, total_tax_rules } = storeToRefs(taxRuleStore);

const rows = computed(() => {
	return tax_rules.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const getAmountTypeLabel = (amountType: string) => {
	const labels: Record<string, string> = {
		gross_amount: 'Gross Amt',
		net_amount: 'Net Amt',
	};
	return labels[amountType] || amountType;
};

const selectTaxRule = async (taxRule: TaxRule) => {
	if (!taxRule) return;

	navigateTo(`/taxes/rules/${taxRule.code}`);
};

const updatePage = async (page: number) => {
	await taxRuleStore.updatePage(page);
};
</script>

<style scoped>
.base {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1rem;
}

@media (min-width: 640px) {
	.base {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
}

.section-empty {
	height: 13rem;
}

.section-empty div {
	text-align: center;
}

.section-empty h2 {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 600;
}

.section-empty p {
	color: var(--color-neutral-400);
}
</style>
