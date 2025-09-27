<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Tax</h2>
					<FormTaxCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<ZSectionFilteroutlet />
					<div>
						<!-- Table  -->
						<UTable :rows="rows" :columns="tax_code_columns" :loading="loading" @select="selectTax">
							<template #code-data="{ row }">
								<div class="flex-col-start">
									<h3 class="text-neutral-800 font-bold">{{ row.code }}</h3>
									<h5 class="text-neutral-400">{{ row.description }}</h5>
								</div>
							</template>

							<template #type-data="{ row }">
								<div class="flex-col-start text-neutral-700">
									<h5>{{ row.is_inclusive ? 'Inclusive' : 'Exclusive' }}</h5>
								</div>
							</template>

							<template #is_active-data="{ row }">
								<div class="flex-col-start text-neutral-700" @click.stop>
									<UToggle :model-value="row.is_active" @update:model-value="onUpdateActive(row)" />
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
						<div v-if="taxes.length > 0" class="section-pagination">
							<UPagination v-model="current_page" :page-count="page_size" :total="total_taxes" @update:model-value="updatePage" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTaxDetail, ZModalLoading } from '#components';
import { tax_code_columns } from '~/utils/table-columns';
import type { Tax } from '~/utils/types/tax';

const links = [
	{
		label: 'Taxes',
		icon: ICONS.TAX,
		to: '/taxes',
	},
	{
		label: 'All Tax Codes',
		icon: ICONS.LIST,
		to: '/taxes/codes',
	},
];

const modal = useModal();
const taxStore = useTaxStore();

useHead({ title: 'Wemotoo CRM - Tax Codes' });

onMounted(async () => {
	await taxStore.getTaxes();
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const { loading, taxes, page_size, current_page, total_taxes } = storeToRefs(taxStore);

const rows = computed(() => {
	return taxes.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const deleteTax = async (code: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this outlet?',
		action: 'delete',
		onConfirm: async () => {
			await taxStore.deleteTax(code);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectTax = async (tax: Tax) => {
	if (!tax) return;

	modal.open(ZModalTaxDetail, {
		tax: JSON.parse(JSON.stringify(tax)),
		onUpdate: async (_tax: Tax) => {
			await taxStore.updateTax(tax.code, {
				..._tax,
				metadata: tax.metadata || undefined,
			});
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteTax(tax.code);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const onUpdateActive = async (tax: Tax) => {
	try {
		modal.open(ZModalLoading, {
			key: 'loading',
		});

		await taxStore.updateTax(tax.code, {
			...tax,
			is_active: !tax.is_active,
			metadata: tax.metadata || undefined,
		});
	} catch (error) {
		console.error(error);
	} finally {
		modal.close();
	}
};

const updatePage = async (page: number) => {
	await taxStore.updatePage(page);
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
