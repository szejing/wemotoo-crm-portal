<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Outlet</h2>
					<FormOutletCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<!-- <ZSectionFilteroutlet /> -->
					<div>
						<!-- Table  -->
						<UTable :rows="rows" :columns="outlet_columns" :loading="loading" @select="selectOutlet">
							<template #code-data="{ row }">
								<div class="flex-col-start">
									<h3 class="text-neutral-800 font-bold">{{ row.code }}</h3>
									<h5 class="text-neutral-400">{{ row.description }}</h5>
								</div>
							</template>

							<template #address-data="{ row }">
								<div class="flex-col-start text-neutral-700">
									<h5>{{ row.address1 }}, {{ row.address2 }}, {{ row.address3 }}</h5>
									<h5>{{ row.city }} {{ row.postal_code }}, {{ row.state }}, {{ row.country_code }}</h5>
								</div>
							</template>

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No outlet Found</h2>
									<p>Create a new outlet to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="outlets.length > 0" class="section-pagination">
							<UPagination v-model="current_page" :page-count="page_size" :total="total_outlets" @update:model-value="updatePage" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalOutletDetail } from '#components';
import { outlet_columns } from '~/utils/table-columns';
import type { Outlet } from '~/utils/types/outlet';

const links = [
	{
		label: 'All Outlets',
		icon: ICONS.ADDITIONAL,
		to: '/outlets',
	},
];

const modal = useModal();
const outletStore = useOutletStore();

useHead({ title: 'Wemotoo CRM - Outlets' });

onMounted(async () => {
	await outletStore.getOutlets();
});

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const { loading, outlets, page_size, current_page, total_outlets } = storeToRefs(outletStore);

const rows = computed(() => {
	return outlets.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const deleteOutlet = async (code: string) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this outlet?',
		action: 'delete',
		onConfirm: async () => {
			await outletStore.deleteOutlet(code);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectOutlet = async (outlet: Outlet) => {
	if (!outlet) return;

	modal.open(ZModalOutletDetail, {
		outlet: JSON.parse(JSON.stringify(outlet)),
		onUpdate: async (_outlet: Outlet) => {
			await outletStore.updateOutlet(outlet.code, _outlet);
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteOutlet(outlet.code);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const updatePage = async (page: number) => {
	await outletStore.updatePage(page);
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
	@apply text-neutral-400;
}
</style>
