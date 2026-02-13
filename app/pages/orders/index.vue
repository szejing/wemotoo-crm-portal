<template>
	<UDashboardPanel id="orders">
		<template #header>
			<UDashboardNavbar :title="$t('nav.orders')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
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
				<div class="flex flex-col sm:flex-row sm:items-center justify-end sm:justify-between gap-4">
					<!-- Status Tabs - Desktop -->
					<div class="hidden sm:flex gap-2">
						<UButton
							v-for="(tab, index) in tabItems"
							:key="tab.value"
							:variant="selectedTab === index ? 'solid' : 'soft'"
							:color="selectedTab === index ? 'primary' : 'neutral'"
							@click="selectTab(index)"
						>
							{{ tab.label }}
						</UButton>
					</div>

					<!-- Table Actions -->
					<ZTableToolbar
						v-model="filter.page_size"
						:page-size-options="options_page_size"
						:export-enabled="true"
						:exporting="exporting"
						@update:model-value="updatePageSize"
						@export="exportOrders"
					/>
				</div>

				<template v-if="initialize">
					<div class="rounded-lg overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
						<div class="grid grid-cols-4 gap-4 p-4">
							<USkeleton v-for="i in 4" :key="i" class="h-4 flex-1 min-w-0" />
						</div>
						<div v-for="i in 5" :key="i" class="grid grid-cols-4 gap-4 p-4 items-center">
							<USkeleton v-for="j in 4" :key="j" class="h-4 flex-1 min-w-0" />
						</div>
					</div>
				</template>
				<!-- Orders Table -->
				<UCard v-else class="[&>div]:p-0!">
					<UTable
						:data="orders"
						:columns="order_columns"
						:loading="loading"
						class="[&_tr]:hover:bg-gray-50 dark:[&_tr]:hover:bg-gray-800/50 [&_tr]:cursor-pointer [&_tr]:transition-colors"
						@select="selectOrder"
					>
						<template #empty>
							<div class="flex flex-col items-center justify-center py-12 gap-3">
								<UIcon name="i-heroicons-shopping-cart" class="w-12 h-12 text-gray-400" />
								<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noOrdersFound') }}</p>
								<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
							</div>
						</template>
					</UTable>

					<!-- Pagination -->
					<div v-if="!initialize && orders.length > 0" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3">
						<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
							<div class="text-sm text-gray-700 dark:text-gray-300">
								{{
									$t('pages.showingToOf', {
										from: (current_page - 1) * filter.page_size + 1,
										to: Math.min(current_page * filter.page_size, orderStore.total_orders),
										total: orderStore.total_orders,
									})
								}}
							</div>
							<UPagination
								v-model="current_page"
								:total="orderStore.total_orders"
								:page-size="filter.page_size"
								show-last
								show-first
								size="sm"
								@update:page="updatePage"
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
import { getOrderColumns } from '~/utils/table-columns';
import type { TableRow } from '@nuxt/ui';
import type { OrderHistory } from '~/utils/types/order-history';

const { t } = useI18n();
const order_columns = computed(() => getOrderColumns(t));
useHead({ title: () => t('pages.ordersTitle') });

const orderStore = useOrderStore();
const { orders, filter, loading, exporting } = storeToRefs(orderStore);
const current_page = computed(() => filter.value.current_page);
const selectedTab = ref(0);

const tabItems = computed(() => [
	{ label: t('options.all'), value: 'All' },
	{ label: t('options.pending'), value: OrderStatus.PENDING_PAYMENT },
	{ label: t('options.completed'), value: OrderStatus.COMPLETED },
	{ label: t('options.cancelled'), value: OrderStatus.CANCELLED },
]);

const initialize = ref(true);

onMounted(async () => {
	initialize.value = true;
	try {
		await orderStore.getOrders();
	} finally {
		initialize.value = false;
	}
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

const selectOrder = async (e: Event, row: TableRow<OrderHistory>) => {
	const order = row.original;
	if (!order) return;

	if (order.type === 'order') {
		navigateTo(`/orders/detail/${encodeURIComponent(order.transaction_no)}`);
	} else {
		navigateTo(`/orders/sale/detail/${encodeURIComponent(order.transaction_no)}`);
	}
};
</script>

<style scoped></style>
