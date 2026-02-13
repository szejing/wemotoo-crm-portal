<template>
	<UDashboardPanel id="outlets">
		<template #header>
			<UDashboardNavbar :title="$t('nav.outlets')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<ZCreateButton to="/outlets/create" />
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
				<ZTableToolbar
					v-model="filter.page_size"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="exporting"
					@update:model-value="updatePageSize"
					@export="exportOutlets"
				/>

				<template v-if="initialize">
					<div class="rounded-lg overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
						<div class="grid grid-cols-[1fr_auto] gap-4 p-4">
							<USkeleton class="h-4 w-24" />
							<USkeleton class="h-4 w-16" />
						</div>
						<div v-for="i in 5" :key="i" class="grid grid-cols-[1fr_auto] gap-4 p-4 items-center">
							<USkeleton class="h-4 w-40" />
							<USkeleton class="h-4 w-12" />
						</div>
					</div>
				</template>
				<UTable v-else :data="outlets" :columns="outlet_columns" :loading="loading" loading-state="loading" @select="selectOutlet">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon name="i-heroicons-building-office" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noOutletsFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="!initialize && outlets.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_outlets" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalOutletDetail } from '#components';
import { getOutletColumns } from '~/utils/table-columns';
import type { Outlet } from '~/utils/types/outlet';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';

const overlay = useOverlay();
const outletStore = useOutletStore();
const { t } = useI18n();
const outlet_columns = computed(() => getOutletColumns(t));

useHead({ title: () => t('pages.outletsTitle') });

const { loading, exporting, outlets, filter, total_outlets } = storeToRefs(outletStore);
const initialize = ref(true);

onMounted(async () => {
	initialize.value = true;
	try {
		await outletStore.getOutlets();
	} finally {
		initialize.value = false;
	}
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

const selectOutlet = async (e: Event, row: TableRow<Outlet>) => {
	const outlet = row.original;
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
