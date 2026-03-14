<template>
	<ZPagePanel id="orders" :title="$t('nav.orders')">
		<template #toolbar>
			<ZSectionFilterOrders />
		</template>

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

			<template v-if="loading">
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
			<UTable v-if="!initialize && !loading" :data="orders" :columns="order_columns" :ui="{ tr: 'cursor-pointer' }" @select="selectOrder">
				<template #empty>
					<div class="flex flex-col items-center justify-center py-12 gap-3">
						<UIcon name="i-heroicons-shopping-cart" class="w-12 h-12 text-gray-400" />
						<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noOrdersFound') }}</p>
						<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
					</div>
				</template>
			</UTable>

			<!-- Pagination -->
			<div
				v-if="!initialize && !loading && orders.length > 0"
				class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3"
			>
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
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { getOrderColumns } from '~/utils/table-columns';
import type { TableRow } from '@nuxt/ui';
import type { OrderHistory } from '~/utils/types/order-history';

const route = useRoute();
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
	{ label: t('options.refunded'), value: OrderStatus.REFUNDED },
	{ label: t('options.requiresAction'), value: OrderStatus.REQUIRES_ACTION },
]);

function tabIndexForStatus(status: OrderStatus | string): number {
	if (status === OrderStatus.PENDING_PAYMENT || status === OrderStatus.PROCESSING) return 1;
	if (status === OrderStatus.COMPLETED) return 2;
	if (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) return 3;
	return 0;
}

function storeStatusFromQuery(status: string): OrderStatus | undefined {
	if (status === OrderStatus.PENDING_PAYMENT || status === OrderStatus.PROCESSING) return OrderStatus.PENDING_PAYMENT;
	if (status === OrderStatus.COMPLETED) return OrderStatus.COMPLETED;
	if (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) return OrderStatus.CANCELLED;
	return undefined;
}

const VALID_ORDER_STATUSES = new Set(Object.values(OrderStatus));

function applyQueryToFilter() {
	const start = route.query.start_date;
	const end = route.query.end_date;
	const status = route.query.status;
	if (typeof start === 'string' && start) {
		const d = new Date(start);
		if (!Number.isNaN(d.getTime())) {
			filter.value.date_range.start = d;
		}
	}
	if (typeof end === 'string' && end) {
		const d = new Date(end);
		if (!Number.isNaN(d.getTime())) {
			filter.value.date_range.end = d;
		}
	}
	if (typeof status === 'string' && VALID_ORDER_STATUSES.has(status as OrderStatus)) {
		const mapped = storeStatusFromQuery(status);
		if (mapped != null) {
			filter.value.status = mapped;
			selectedTab.value = tabIndexForStatus(status);
		}
	}
}

const initialize = ref(true);

onMounted(async () => {
	applyQueryToFilter();
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
		navigateTo(`/sales/orders/detail/${encodeURIComponent(order.order_no)}`);
	} else {
		navigateTo(`/sales/orders/sale/detail/${encodeURIComponent(order.order_no)}`);
	}
};
</script>

<style scoped></style>
