<template>
	<UDashboardPanel id="analytics-orders-items">
		<template #header>
			<UDashboardNavbar :title="$t('pages.analyticsOrdersItems')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterOrderSummItems />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<!-- Empty State -->
			<div v-if="!is_loading && groupedByDate.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
				<UIcon :name="ICONS.REPORT_ORDER" class="w-12 h-12 text-gray-400" />
				<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noOrderItemSummaryFound') }}</p>
				<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
			</div>

			<!-- Grouped by Date -->
			<div v-else class="mt-4 space-y-6">
				<ZTableToolbar
					v-model="order_summ_item.page_size"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="order_summ_item.exporting"
					@update:model-value="updatePageSize"
					@export="exportToCsv"
				/>

				<UCard class="overflow-hidden">
					<div v-for="(group, index) in groupedByDate" :key="group.date" class="mt-4">
						<!-- Date Header -->
						<div class="bg-linear-to-r from-primary/5 to-primary/10 border-l-4 border-primary px-6 py-4" :class="{ 'border-t border-neutral-200': index > 0 }">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<h3 class="text-lg font-bold text-neutral-900">{{ getFormattedDate(new Date(group.date)) }}</h3>
									<div class="flex items-center gap-3 text-sm">
										<div class="flex items-center gap-1.5 text-neutral-600">
											<Icon name="i-heroicons-shopping-cart" class="text-base" />
											<span class="font-medium">{{ group.total_orders }} {{ $t('pages.ordersLabel') }}</span>
										</div>
										<div class="h-4 w-px bg-neutral-300"></div>
										<div class="flex items-center gap-1.5 text-green-600">
											<Icon name="i-heroicons-cube" class="text-base" />
											<span class="font-medium">{{ group.active_qty }} {{ $t('pages.itemsLabel') }}</span>
										</div>
										<div v-if="group.voided_qty > 0" class="h-4 w-px bg-neutral-300"></div>
										<div v-if="group.voided_qty > 0" class="flex items-center gap-1.5 text-red-600">
											<Icon name="i-heroicons-x-circle" class="text-base" />
											<span class="font-medium">{{ group.voided_qty }} {{ $t('pages.voidedLabel') }}</span>
										</div>
									</div>
								</div>
								<div class="flex items-center gap-2 text-sm font-semibold text-primary">
									<span>{{ $t('pages.totalLabel') }}: {{ formatCurrency(group.net_amt, group.currency_code) }}</span>
								</div>
							</div>
						</div>

						<!-- Items Table -->
						<div class="px-6 pb-6 pt-4">
							<UTable
								:data="group.items"
								:columns="order_summ_item_columns"
								:ui="{
									root: 'relative overflow-auto',
									base: 'table-fixed',
									tbody: 'divide-y divide-gray-200',
									tr: '',
								}"
							/>
						</div>
					</div>
				</UCard>
			</div>

			<!-- Pagination -->
			<div v-if="data.length > 0" class="mt-6 flex justify-center">
				<UPagination v-model="current_page" :items-per-page="order_summ_item.page_size" :total="order_summ_item.total_data" @update:page="updatePage" />
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { OrderItemStatus, getFormattedDate, formatCurrency } from 'wemotoo-common';
import { getOrderSummItemColumns } from '~/utils/table-columns';
import { options_page_size } from '~/utils/options';

const { t } = useI18n();
const order_summ_item_columns = computed(() => getOrderSummItemColumns(t));
useHead({ title: () => t('pages.orderItemSummary') });

onMounted(async () => {
	await orderSummStore.getOrderItemSummary();
});

const orderSummStore = useSummOrderStore();
const { order_summ_item } = storeToRefs(orderSummStore);
const current_page = computed(() => order_summ_item.value.current_page);

const is_loading = computed(() => order_summ_item.value.loading);
const data = computed(() => order_summ_item.value.data);

// Group data by date
const groupedByDate = computed(() => {
	const grouped: { [key: string]: (typeof data.value)[0][] } = {};

	data.value.forEach((item) => {
		const date = new Date(item.biz_date).toISOString().split('T')[0] as string;
		if (!grouped[date]) {
			grouped[date] = [];
		}
		grouped[date].push(item);
	});

	return Object.entries(grouped).map(([date, items]) => {
		const totals = items.reduce(
			(acc, item) => {
				acc.total_orders += item.total_orders;
				acc.total_qty += item.total_qty;
				acc.gross_amt += item.gross_amt;
				acc.net_amt += item.net_amt;
				acc.currency_code = item.currency_code;

				// Separate voided and non-voided quantities
				if (item.item_status === OrderItemStatus.VOIDED) {
					acc.voided_qty += item.total_qty;
				} else {
					acc.active_qty += item.total_qty;
				}
				return acc;
			},
			{ total_orders: 0, total_qty: 0, gross_amt: 0, net_amt: 0, voided_qty: 0, active_qty: 0, currency_code: 'MYR' },
		);

		return {
			date,
			items,
			...totals,
		};
	});
});

const updatePage = async (page: number) => {
	order_summ_item.value.current_page = page;
	await orderSummStore.getOrderItemSummary();
};

const updatePageSize = async (size: number) => {
	await orderSummStore.updateOrderItemSummPageSize(size);
};

const exportToCsv = async () => {
	await orderSummStore.exportOrderItemSummary();
};
</script>

<style scoped>
:deep(tr:last-child) {
	background-color: rgb(249 250 251);
	border-top: 2px solid rgb(209 213 219);
}

:deep(table) {
	table-layout: fixed;
}

:deep(th:nth-child(1)),
:deep(td:nth-child(1)) {
	width: 25%;
}

:deep(th:nth-child(2)),
:deep(td:nth-child(2)) {
	width: 15%;
}

:deep(th:nth-child(3)),
:deep(td:nth-child(3)) {
	width: 15%;
}

:deep(th:nth-child(4)),
:deep(td:nth-child(4)) {
	width: 15%;
}

:deep(th:nth-child(5)),
:deep(td:nth-child(5)) {
	width: 15%;
}

:deep(th:nth-child(6)),
:deep(td:nth-child(6)) {
	width: 15%;
}
</style>
