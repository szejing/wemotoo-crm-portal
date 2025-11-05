<template>
	<UDashboardPanel id="taxes-groups">
		<template #header>
			<UDashboardNavbar title="Tax Groups" :ui="{ right: 'gap-3' }">
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
					<ZSectionFilterTaxGroups />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table Controls -->
				<div class="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
					<!-- Page Size -->
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
						<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
						<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
					</div>

					<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportTaxGroups">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</div>

				<!-- Table  -->
				<UTable :data="rows" :columns="tax_group_columns" :loading="loading" @select="selectTaxGroup">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.TAX" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No tax groups found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="tax_groups.length > 0" class="section-pagination">
					<UPagination :default-page="filter.current_page" :items-per-page="filter.page_size" :total="total_tax_groups" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTaxGroupDetail } from '#components';
import { tax_group_columns } from '~/utils/table-columns';
import type { TaxGroup } from '~/utils/types/tax-group';
import type { TableRow } from '@nuxt/ui';
import { options_page_size } from '~/utils/options';

const overlay = useOverlay();
const taxGroupStore = useTaxGroupStore();
const { loading, tax_groups, filter, total_tax_groups, exporting } = storeToRefs(taxGroupStore);

useHead({ title: 'Wemotoo CRM - Tax Groups' });

onMounted(async () => {
	await taxGroupStore.getTaxGroups();
});

const rows = computed(() => {
	return tax_groups.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const deleteTaxGroup = async (code: string) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this outlet?',
			action: 'delete',
			onConfirm: async () => {
				await taxGroupStore.deleteTaxGroup(code);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectTaxGroup = async (e: Event, row: TableRow<TaxGroup>) => {
	const taxGroup = row.original;
	if (!taxGroup) return;

	const taxGroupModal = overlay.create(ZModalTaxGroupDetail, {
		props: {
			taxGroup: JSON.parse(JSON.stringify(taxGroup)),
			onUpdate: async (_taxGroup: TaxGroup) => {
				await taxGroupStore.updateTaxGroup(taxGroup.code, {
					..._taxGroup,
					taxes: _taxGroup.taxes,
				});
				taxGroupModal.close();
			},
			onDelete: async () => {
				taxGroupModal.close();
				await deleteTaxGroup(taxGroup.code);
			},
			onCancel: () => {
				taxGroupModal.close();
			},
		},
	});

	taxGroupModal.open();
};

const updatePage = async (page: number) => {
	await taxGroupStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await taxGroupStore.updatePageSize(size);
};

const exportTaxGroups = async () => {
	// await taxGroupStore.exportTaxGroups();
};
</script>

<style scoped></style>
