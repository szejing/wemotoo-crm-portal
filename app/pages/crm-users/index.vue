<template>
	<UDashboardPanel id="crm-users">
		<template #header>
			<UDashboardNavbar title="CRM Users" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterCrmUsers />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table controls: page size -->
				<div class="flex flex-row sm:items-center justify-between sm:justify-end gap-4">
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
						<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
						<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
					</div>
				</div>

				<!-- Table -->
				<UTable
					:data="rows"
					:columns="crm_user_columns"
					:loading="loading"
					:ui="{
						tr: 'cursor-pointer',
					}"
					@select="selectCrmUser"
				>
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No CRM users found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your search to see more results.</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination -->
				<div v-if="crm_users.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_count" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { crm_user_columns } from '~/utils/table-columns';
import type { CRMUser } from '~/utils/types/crm-user';
import type { TableRow } from '@nuxt/ui';
import { useCRMUserStore } from '~/stores/CRMUser/CRMUser';

useHead({ title: 'Wemotoo CRM - CRM Users' });

const crmUserStore = useCRMUserStore();
const { loading, crm_users, filter, total_count } = storeToRefs(crmUserStore);

const rows = computed(() => {
	const start = (filter.value.current_page - 1) * filter.value.page_size;
	const end = filter.value.current_page * filter.value.page_size;
	return crm_users.value.slice(start, end);
});

function selectCrmUser(_e: Event, row: TableRow<CRMUser>) {
	const user = row.original;
	if (!user?.id) return;
	navigateTo(`/crm-users/${encodeURIComponent(user.id)}`);
}

async function updatePage(page: number) {
	await crmUserStore.updatePage(page);
}

async function updatePageSize(size: number) {
	await crmUserStore.updatePageSize(size);
}

onMounted(() => {
	crmUserStore.getCrmUsers();
});
</script>

<style scoped></style>
