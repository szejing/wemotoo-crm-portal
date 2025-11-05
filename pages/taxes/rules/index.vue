<template>
	<UDashboardPanel id="taxes-rules">
		<template #header>
			<UDashboardNavbar title="Tax Rules" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
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
					<UTable :data="rows" :columns="tax_rule_columns" :loading="loading" @select="selectTaxRule">
						<template #empty-state>
							<div class="flex-col-center section-empty">
								<h2>No tax code Found</h2>
								<p>Create a new tax code to get started</p>
							</div>
						</template>
					</UTable>

					<!-- Pagination  -->
					<div v-if="tax_rules.length > 0" class="section-pagination">
						<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_tax_rules" @update:page="updatePage" />
					</div>
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { tax_rule_columns } from '~/utils/table-columns';
import type { TaxRule } from '~/utils/types/tax-rule';
import type { TableRow } from '@nuxt/ui';

const taxRuleStore = useTaxRuleStore();

useHead({ title: 'Wemotoo CRM - Tax Rules' });

onMounted(async () => {
	await taxRuleStore.getTaxRules();
});

const { loading, tax_rules, page_size, current_page, total_tax_rules } = storeToRefs(taxRuleStore);

const rows = computed(() => {
	return tax_rules.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const selectTaxRule = async (e: Event, row: TableRow<TaxRule>) => {
	const taxRule = row.original;
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
