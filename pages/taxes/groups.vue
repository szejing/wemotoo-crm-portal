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
						<UTable :rows="rows" :columns="tax_group_columns" :loading="loading" @select="selectTaxGroup">
							<template #code-data="{ row }">
								<div class="flex-col-start">
									<h3 class="text-neutral-800 font-bold">{{ row.code }}</h3>
									<h5 class="text-neutral-400">{{ row.description }}</h5>
								</div>
							</template>

							<template #taxes-data="{ row }">
								<div class="flex-col-start">
									<div v-for="tax in row.taxes" :key="tax.code" class="flex-col-start">
										<h3 class="text-neutral-800 font-bold">
											{{ tax.code }}
											<span class="text-neutral-400 font-light italic text-xs">({{ tax.description }})</span>
										</h3>
									</div>
								</div>
							</template>

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No tax group Found</h2>
									<p>Create a new tax group to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="tax_groups.length > 0" class="section-pagination">
							<UPagination v-model="page" :page-count="page_size" :total="tax_groups.length" />
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

const modal = useModal();
const page = ref(1);
const taxGroupStore = useTaxGroupStore();
const { loading, tax_groups, page_size } = storeToRefs(taxGroupStore);

onMounted(async () => {
	await taxGroupStore.getTaxGroups();
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const rows = computed(() => {
	return tax_groups.value.slice((page.value - 1) * page_size.value, page.value * page_size.value);
});

const deleteTaxGroup = async (code: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this outlet?',
		action: 'delete',
		onConfirm: async () => {
			await taxGroupStore.deleteTaxGroup(code);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectTaxGroup = async (taxGroup: TaxGroup) => {
	if (!taxGroup) return;

	modal.open(ZModalTaxGroupDetail, {
		taxGroup: JSON.parse(JSON.stringify(taxGroup)),
		onUpdate: async (_taxGroup: TaxGroup) => {
			await taxGroupStore.updateTaxGroup(taxGroup.code, {
				..._taxGroup,
				taxes: _taxGroup.taxes,
			});
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteTaxGroup(taxGroup.code);
		},
		onCancel: () => {
			modal.close();
		},
	});
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
