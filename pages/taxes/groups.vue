<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Tax Group</h2>
					<FormTaxGroupCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<!-- <ZSectionFilteroutlet /> -->
					<div>
						<!-- Table  -->
						<UTable :data="rows" :columns="tax_group_columns" :loading="loading" @select-row="selectTaxGroup">
							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No tax group Found</h2>
									<p>Create a new tax group to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="tax_groups.length > 0" class="section-pagination">
							<UPagination v-model="current_page" :page-count="page_size" :total="total_tax_groups" @update:model-value="updatePage" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTaxGroupDetail } from '#components';
import { tax_group_columns } from '~/utils/table-columns';
import type { TaxGroup } from '~/utils/types/tax-group';

const links = [
	{
		label: 'Taxes',
		icon: ICONS.TAX,
		to: '/taxes',
	},
	{
		label: 'All Tax Groups',
		icon: ICONS.LIST,
		to: '/taxes/groups',
	},
];

const overlay = useOverlay();
const taxGroupStore = useTaxGroupStore();
const { loading, tax_groups, page_size, current_page, total_tax_groups } = storeToRefs(taxGroupStore);

useHead({ title: 'Wemotoo CRM - Tax Groups' });

onMounted(async () => {
	await taxGroupStore.getTaxGroups();
});

const rows = computed(() => {
	return tax_groups.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
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

const selectTaxGroup = async (taxGroup: TaxGroup) => {
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
