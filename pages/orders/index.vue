<template>
	<UDashboardPanel id="orders">
		<template #header>
			<UDashboardNavbar title="Orders" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterOrders />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Table Controls -->
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<!-- Status Tabs - Desktop -->
					<div class="hidden sm:flex gap-2">
						<UButton
							v-for="(tab, index) in tabItems"
							:key="tab.value"
							:variant="selectedTab === index ? 'solid' : 'soft'"
							:color="selectedTab === index ? 'primary' : 'neutral'"
							size="sm"
							@click="selectTab(index)"
						>
							{{ tab.label }}
						</UButton>
					</div>

					<!-- Table Actions -->
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
							<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="updatePageSize" />
							<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
						</div>

						<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportOrders">
							<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
							Export
						</UButton>
					</div>
				</div>

				<!-- Orders Table -->
				<UCard class="[&>div]:p-0!">
					<UTable
						:data="rows"
						:columns="order_columns"
						:loading="loading"
						class="[&_tr]:hover:bg-gray-50 dark:[&_tr]:hover:bg-gray-800/50 [&_tr]:cursor-pointer [&_tr]:transition-colors"
						@select-row="selectOrder"
					>
						<template #empty>
							<div class="flex flex-col items-center justify-center py-12 gap-3">
								<UIcon name="i-heroicons-shopping-cart" class="w-12 h-12 text-gray-400" />
								<p class="text-sm text-gray-600 dark:text-gray-400">No orders found.</p>
								<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
							</div>
						</template>
					</UTable>

					<!-- Pagination -->
					<div v-if="orders.length > 0" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3">
						<div class="flex-1 flex justify-between sm:hidden">
							<UButton variant="outline" size="sm" :disabled="current_page <= 1" @click="updatePage(current_page - 1)"> Previous </UButton>
							<UButton variant="outline" size="sm" :disabled="current_page * filter.page_size >= orderStore.total_orders" @click="updatePage(current_page + 1)">
								Next
							</UButton>
						</div>
						<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
							<div class="text-sm text-gray-700 dark:text-gray-300">
								Showing <span class="font-medium">{{ (current_page - 1) * filter.page_size + 1 }}</span> to
								<span class="font-medium">{{ Math.min(current_page * filter.page_size, orderStore.total_orders) }}</span> of
								<span class="font-medium">{{ orderStore.total_orders }}</span> results
							</div>
							<UPagination
								v-model="current_page"
								:total="orderStore.total_orders"
								:page-size="filter.page_size"
								show-last
								show-first
								size="sm"
								@update:model-value="updatePage"
							/>
						</div>
					</div>
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { order_columns } from '~/utils/table-columns';
import type { Order } from '~/utils/types/order';

useHead({ title: 'Wemotoo CRM - Orders' });

const orderStore = useOrderStore();
const { orders, filter, loading, exporting } = storeToRefs(orderStore);
const current_page = computed(() => filter.value.current_page);
const selectedTab = ref(0);

const tabItems = computed(() => [
	{
		label: 'All',
		value: 'All',
	},
	{
		label: 'Pending',
		value: OrderStatus.PENDING_PAYMENT,
	},
	{
		label: 'Completed',
		value: OrderStatus.COMPLETED,
	},
	{
		label: 'Cancelled',
		value: OrderStatus.CANCELLED,
	},
]);

// Load orders on mount
onMounted(async () => {
	if (orders.value.length === 0) {
		await orderStore.getOrders();
	}
});

const rows = computed(() => {
	return orders.value.slice((current_page.value - 1) * filter.value.page_size, current_page.value * filter.value.page_size);
});

const selectTab = async (index: number) => {
	selectedTab.value = index;
	filter.value.current_page = 1;
	filter.value.status = tabItems.value[index]?.value as OrderStatus;
	await orderStore.getOrders();
};

const updatePageSize = async (size: number) => {
	filter.value.page_size = size;
	filter.value.current_page = 1;
	await orderStore.getOrders();
};

const updatePage = async (page: number) => {
	filter.value.current_page = page;
	await orderStore.getOrders();
};

const exportOrders = async () => {
	await orderStore.exportOrders();
};

const selectOrder = (row: Order) => {
	navigateTo(`/orders/detail/${encodeURIComponent(row.order_no)}`);
};
</script>

<style scoped></style>
