<template>
	<UDashboardPanel id="taxes-codes">
		<template #header>
			<UDashboardNavbar title="Tax Codes" :ui="{ right: 'gap-3' }">
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
					<ZSectionFilterTaxCodes />
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

				<!-- Table  -->
				<UTable :data="rows" :columns="tax_code_columns" :loading="loading" @select="selectTax">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.TAX" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No tax codes found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="taxes.length > 0" class="section-pagination">
					<UPagination :default-page="filter.current_page" :items-per-page="filter.page_size" :total="total_taxes" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTaxDetail } from '#components';
import { tax_code_columns } from '~/utils/table-columns';
import type { Tax } from '~/utils/types/tax';
import type { TableRow } from '@nuxt/ui';
import { options_page_size } from '~/utils/options';

useHead({ title: 'Wemotoo CRM - Tax Codes' });

onMounted(async () => {
	await taxStore.getTaxes();
});

const overlay = useOverlay();
const taxStore = useTaxStore();
const { loading, taxes, filter, total_taxes, exporting } = storeToRefs(taxStore);

const rows = computed(() => {
	return taxes.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const deleteTax = async (code: string) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this outlet?',
			action: 'delete',
			onConfirm: async () => {
				await taxStore.deleteTax(code);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectTax = async (e: Event, row: TableRow<Tax>) => {
	const tax = row.original;
	if (!tax) return;

	const taxModal = overlay.create(ZModalTaxDetail, {
		props: {
			tax: JSON.parse(JSON.stringify(tax)),
			onUpdate: async (_tax: Tax) => {
				await taxStore.updateTax(tax.code, {
					..._tax,
					metadata: tax.metadata || undefined,
				});
				taxModal.close();
			},
			onDelete: async () => {
				taxModal.close();
				await deleteTax(tax.code);
			},
			onCancel: () => {
				taxModal.close();
			},
		},
	});

	taxModal.open();
};

const updatePage = async (page: number) => {
	await taxStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await taxStore.updatePageSize(size);
};

const exportTaxes = async () => {
	// await taxStore.exportTaxes();
};
</script>

<style scoped></style>
