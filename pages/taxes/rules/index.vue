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
				<UTable :rows="rows" :columns="tax_rule_columns" :loading="loading" @select="selectTax">
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
					<UPagination v-model="page" :page-count="page_size" :total="tax_rules.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalLoading } from '#components';
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
const page = ref(1);
const taxRuleStore = useTaxRuleStore();

onMounted(async () => {
	await taxRuleStore.getTaxRules();
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const { loading, tax_rules, page_size } = storeToRefs(taxRuleStore);

const rows = computed(() => {
	return tax_rules.value.slice((page.value - 1) * page_size.value, page.value * page_size.value);
});

const getAmountTypeLabel = (amountType: string) => {
	const labels: Record<string, string> = {
		gross_amount: 'Gross Amt',
		net_amount: 'Net Amt',
	};
	return labels[amountType] || amountType;
};

const selectTax = async (taxRule: TaxRule) => {
	if (!taxRule) return;

	modal.open(ZModalLoading, {
		key: 'loading',
	});

	const tr = await taxRuleStore.getTaxRuleByCode(taxRule.code!);
	await modal.close();

	if (tr) {
		taxRuleStore.current_tax_rule = taxRule;

		navigateTo(`/taxes/rules/${tr.code}`);
	}
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
