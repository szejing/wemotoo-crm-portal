<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="page_size" :options="options_page_size" /> </span>

					<div class="flex gap-4">
						<UButton color="green" @click="navigateTo('/taxes/rules/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>
				<!-- Table  -->
				<UTable :rows="rows" :columns="tax_rule_columns" :loading="loading" @select="selectTaxRule">
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
									<div class="border-l-2 border-gray-300 pl-2 space-y-1">
										<h4 class="text-gray-800 font-bold">{{ detail.tax?.description || detail.description }}</h4>
										<div v-if="detail.tax_condition" class="flex items-center gap-2 mt-2">
											<UBadge :label="getAmountTypeLabel(detail.tax_condition.amount_type)" variant="soft" size="md" />
											<UBadge :label="`${detail.tax_condition.rate * 100}%`" variant="soft" color="green" size="md" />
										</div>
									</div>
								</div>
							</div>
							<div v-else class="text-xs text-gray-400">No details configured</div>
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

const modal = useModal();
const taxRuleStore = useTaxRuleStore();

useHead({ title: 'Wemotoo CRM - Tax Rules' });

onMounted(async () => {
	await taxRuleStore.getTaxRules();
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
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

<style scoped lang="postcss">
.base {
	@apply container grid grid-cols-1 sm:grid-cols-6 gap-6 mt-4;
}

.section-empty {
	@apply h-52;
}

.section-empty div {
	@apply text-center;
}

.section-empty h2 {
	@apply text-2xl font-semibold;
}

.section-empty p {
	@apply text-gray-400;
}
</style>
