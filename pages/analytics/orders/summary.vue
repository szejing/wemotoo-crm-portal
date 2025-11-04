<template>
	<UDashboardPanel id="analytics-orders-summary">
		<template #header>
			<UDashboardNavbar title="Analytics Orders Summary" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<UButton variant="outline" :disabled="order_summ.exporting" :loading="order_summ.exporting" @click="exportOrderSummaryToCsv">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterOrderSumm />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<!-- Empty State -->
			<div v-if="!loading && groupedByDate.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
				<UIcon name="i-heroicons-chart-bar" class="w-12 h-12 text-gray-400" />
				<p class="text-sm text-gray-600 dark:text-gray-400">No order summary data found.</p>
				<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
			</div>

			<!-- Grouped by Date -->
			<div v-else class="mt-4">
				<UCard class="overflow-hidden">
					<div v-for="(group, index) in groupedByDate" :key="group.date">
						<!-- Date Header -->
						<div class="bg-linear-to-r from-primary/5 to-primary/10 border-l-4 border-primary px-6 py-4" :class="{ 'border-t border-neutral-200': index > 0 }">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<h3 class="text-lg font-bold text-neutral-900">{{ getFormattedDate(new Date(group.date)) }}</h3>
									<div class="flex items-center gap-3 text-sm">
										<div class="flex items-center gap-1.5 text-neutral-600">
											<Icon name="i-heroicons-shopping-cart" class="text-base" />
											<span class="font-medium">{{ group.total_orders }} orders</span>
										</div>
										<div class="h-4 w-px bg-neutral-300"></div>
										<div class="flex items-center gap-1.5 text-green-600">
											<Icon name="i-heroicons-cube" class="text-base" />
											<span class="font-medium">{{ group.active_qty }} items</span>
										</div>
										<div v-if="group.voided_qty > 0" class="h-4 w-px bg-neutral-300"></div>
										<div v-if="group.voided_qty > 0" class="flex items-center gap-1.5 text-red-600">
											<Icon name="i-heroicons-x-circle" class="text-base" />
											<span class="font-medium">{{ group.voided_qty }} voided</span>
										</div>
									</div>
								</div>
								<div class="flex items-center gap-2 text-sm font-semibold text-primary">
									<span>Total: {{ group.net_amt.toFixed(2) }}</span>
								</div>
							</div>
						</div>

						<!-- Items Table -->
						<div class="px-6 pb-6 pt-4">
							<UTable :data="group.items" :columns="order_summ_columns" :loading="loading" />
						</div>
					</div>
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { getFormattedDate } from 'wemotoo-common';
import { order_summ_columns } from '~/utils/table-columns';

useHead({ title: 'Wemotoo CRM - Order Summary' });

onMounted(async () => {
	await orderSummStore.getOrderSummary();
});

const orderSummStore = useSummOrderStore();
const { order_summ, loading } = storeToRefs(orderSummStore);

const data = computed(() => order_summ.value.data);

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

				// Calculate voided quantity (total_qty - total_voided_qty = active)
				acc.voided_qty += item.total_voided_qty || 0;
				acc.active_qty += item.total_qty - (item.total_voided_qty || 0);
				return acc;
			},
			{ total_orders: 0, total_qty: 0, gross_amt: 0, net_amt: 0, voided_qty: 0, active_qty: 0 },
		);

		return {
			date,
			items,
			...totals,
		};
	});
});

// const updatePage = async (page: number) => {
// 	order_summ.value.current_page = page;
// 	await orderSummStore.getOrderSummary();
// };

const exportOrderSummaryToCsv = async () => {
	await orderSummStore.exportOrderSummary();
};
</script>

<style scoped></style>
