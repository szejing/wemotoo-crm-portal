<template>
	<UDashboardPanel id="taxes-rules">
		<template #header>
			<UDashboardNavbar :title="$t('nav.taxRules')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<ZCreateButton to="/taxes/rules/create" />
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
				<ZTableToolbar
					v-model="filter.page_size"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="exporting"
					@update:model-value="updatePageSize"
					@export="exportTaxes"
				/>

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
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_tax_rules" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { getTaxRuleColumns } from '~/utils/table-columns';
import type { TaxRule } from '~/utils/types/tax-rule';
import type { TableRow } from '@nuxt/ui';
import { ZModalLoading } from '#components';

const taxRuleStore = useTaxRuleStore();
const overlay = useOverlay();
const { t } = useI18n();
const tax_rule_columns = computed(() => getTaxRuleColumns(t));
const loadingModal = overlay.create(ZModalLoading, { props: { key: 'loading' } });
useHead({ title: () => t('pages.taxRulesTitle') });

onMounted(async () => {
	await taxRuleStore.getTaxRules();
});

const { loading, updating, exporting, tax_rules, filter, total_tax_rules } = storeToRefs(taxRuleStore);

watch(
	() => updating.value,
	(value: boolean) => {
		if (value) {
			loadingModal.open();
		} else {
			loadingModal.close();
		}
	},
);

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
