<template>
	<UDashboardPanel id="outlets">
		<template #header>
			<UDashboardNavbar title="Outlets" :ui="{ right: 'gap-3' }">
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
					<ZSectionFilterOutlet />
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

					<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportOutlets">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</div>

				<!-- Table  -->
				<UTable :data="rows" :columns="outlet_columns" :loading="loading" loading-state="loading" @select-row="selectOutlet">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon name="i-heroicons-building-office" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No outlets found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="outlets.length > 0" class="section-pagination">
					<UPagination :default-page="filter.current_page" :items-per-page="filter.page_size" :total="total_outlets" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalOutletDetail } from '#components';
import { outlet_columns } from '~/utils/table-columns';
import type { Outlet } from '~/utils/types/outlet';
import { options_page_size } from '~/utils/options';

const overlay = useOverlay();
const outletStore = useOutletStore();

useHead({ title: 'Wemotoo CRM - Outlets' });

onMounted(async () => {
	await outletStore.getOutlets();
});

const { loading, exporting, outlets, filter, total_outlets } = storeToRefs(outletStore);

const rows = computed(() => {
	return outlets.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const deleteOutlet = async (code: string) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this outlet?',
			action: 'delete',
			onConfirm: async () => {
				await outletStore.deleteOutlet(code);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectOutlet = async (outlet: Outlet) => {
	if (!outlet) return;

	const outletModal = overlay.create(ZModalOutletDetail, {
		props: {
			outlet: JSON.parse(JSON.stringify(outlet)),
			onUpdate: async (_outlet: Outlet) => {
				await outletStore.updateOutlet(outlet.code, _outlet);
				outletModal.close();
			},
			onDelete: async () => {
				outletModal.close();
				await deleteOutlet(outlet.code);
			},
			onCancel: () => {
				outletModal.close();
			},
		},
	});

	outletModal.open();
};

const updatePage = async (page: number) => {
	await outletStore.updatePage(page);
};

const updatePageSize = async (size: number) => {
	await outletStore.updatePageSize(size);
};

const exportOutlets = async () => {
	// await outletStore.exportOutlets();
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
