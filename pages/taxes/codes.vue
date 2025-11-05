<template>
	<UDashboardPanel id="taxes-codes">
		<template #header>
			<UDashboardNavbar title="Tax Codes" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="base">
				<div class="sm:col-span-2">
					<UCard>
						<h2>Add New Tax</h2>
						<FormTaxCreation class="mt-4" @update:active="onUpdateActive" />
					</UCard>
				</div>

				<div class="sm:col-span-4">
					<UCard>
						<ZSectionFilteroutlet />
						<div>
							<!-- Table  -->
							<UTable :data="rows" :columns="tax_code_columns" :loading="loading" @select="selectTax">
								<template #empty-state>
									<div class="flex-col-center section-empty">
										<h2>No tax code Found</h2>
										<p>Create a new tax code to get started</p>
									</div>
								</template>
							</UTable>

							<!-- Pagination  -->
							<div v-if="taxes.length > 0" class="section-pagination">
								<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_taxes" @update:page="updatePage" />
							</div>
						</div>
					</UCard>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTaxDetail, ZModalLoading } from '#components';
import { tax_code_columns } from '~/utils/table-columns';
import type { Tax } from '~/utils/types/tax';
import type { TableRow } from '@nuxt/ui';

const overlay = useOverlay();
const taxStore = useTaxStore();

useHead({ title: 'Wemotoo CRM - Tax Codes' });

onMounted(async () => {
	await taxStore.getTaxes();
});

const { loading, taxes, page_size, current_page, total_taxes } = storeToRefs(taxStore);

const rows = computed(() => {
	return taxes.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
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

const onUpdateActive = async (e: Event, row: TableRow<Tax>) => {
	const tax = row.original;
	if (!tax) return;

	const loadingModal = overlay.create(ZModalLoading, {
		props: {
			key: 'loading',
		},
	});

	loadingModal.open();

	try {
		await taxStore.updateTax(tax.code, {
			...tax,
			is_active: !tax.is_active,
			metadata: tax.metadata || undefined,
		});
	} catch (error) {
		console.error(error);
	} finally {
		loadingModal.close();
	}
};

const updatePage = async (page: number) => {
	await taxStore.updatePage(page);
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
