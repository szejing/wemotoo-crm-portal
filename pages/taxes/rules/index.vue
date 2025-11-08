<template>
	<UDashboardPanel id="taxes-rules">
		<template #header>
			<UDashboardNavbar title="Tax Rules" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<div class="flex items-center gap-3">
						<UButton color="success" @click="navigateTo('/products/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="w-4 h-4" />
							Create
						</UButton>
					</div>
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterTaxRules />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table Controls -->
				<div class="flex flex-row sm:items-center justify-between sm:justify-end gap-4">
					<!-- Page Size -->
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
						<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
						<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
					</div>

					<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportTaxes">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</div>

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
					<UPagination :default-page="filter.current_page" :items-per-page="filter.page_size" :total="total_tax_rules" @update:page="updatePage" />
				</div>
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

const { loading, exporting, tax_rules, filter, total_tax_rules } = storeToRefs(taxRuleStore);

const rows = computed(() => {
	return tax_rules.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const selectTaxRule = async (e: Event, row: TableRow<TaxRule>) => {
	const taxRule = row.original;
	if (!taxRule) return;

	navigateTo(`/taxes/rules/${taxRule.code}`);
};

const updatePage = async (page: number) => {
	await taxRuleStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await taxRuleStore.updatePageSize(size);
};

const exportTaxes = async () => {
	// await taxRuleStore.exportTaxes();
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
