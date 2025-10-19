<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSaleSummPayments />

			<!-- Loading State -->
			<div v-if="is_loading" class="flex justify-center items-center py-12">
				<div class="text-gray-500">Loading...</div>
			</div>

			<!-- Empty State -->
			<UCard v-else-if="groupedByDate.length === 0" class="mt-4">
				<div class="flex flex-col items-center justify-center py-12 gap-3">
					<Icon name="i-heroicons-inbox" class="text-gray-400 text-4xl" />
					<span class="text-gray-500">No payment data found</span>
				</div>
			</UCard>

			<!-- Grouped by Date -->
			<div v-else class="mt-4">
				<UCard class="overflow-hidden">
					<template #header>
						<div class="flex-jend">
							<UButton :disabled="sale_summ_payments.exporting" :loading="sale_summ_payments.exporting" @click="exportSalesPaymentsToCsv">
								<UIcon :name="ICONS.EXCEL" class="size-5" />
								Export
							</UButton>
						</div>
					</template>

					<div v-for="(group, index) in groupedByDate" :key="group.date">
						<!-- Date Header -->
						<div class="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary px-6 py-4" :class="{ 'border-t border-gray-200': index > 0 }">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<h3 class="text-lg font-bold text-gray-900">{{ getFormattedDate(new Date(group.date)) }}</h3>
									<div class="flex items-center gap-3 text-sm">
										<div class="flex items-center gap-1.5 text-gray-600">
											<Icon name="i-heroicons-banknotes" class="text-base" />
											<span class="font-medium">{{ group.total_txns }} transactions</span>
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
							<UTable
								:rows="group.items"
								:columns="columnsTable"
								:ui="{ tr: { base: '' }, table: 'table-fixed', divide: 'divide-y divide-gray-200', wrapper: 'relative overflow-auto' }"
							>
								<template #status-data="{ row }">
									<div class="flex justify-center">
										<UBadge v-if="row.status == SaleStatus.COMPLETED" variant="soft" color="green" size="xs">Completed</UBadge>
									</div>
								</template>

								<template #currency_code-data="{ row }">
									<p class="text-center">{{ row.currency_code }}</p>
								</template>

								<template #payment_type_code-data="{ row }">
									<p class="text-center">{{ row.payment_type_code }}</p>
								</template>

								<template #payment_type_desc-data="{ row }">
									<p class="text-center">{{ row.payment_type_desc }}</p>
								</template>

								<template #payment_amt-data="{ row }">
									<p class="text-center font-medium text-gray-900">{{ row.payment_amt.toFixed(2) }}</p>
								</template>

								<template #local_amt-data="{ row }">
									<p class="text-center">{{ row.local_amt.toFixed(2) }}</p>
								</template>

								<template #total_txns-data="{ row }">
									<p class="text-center">{{ row.total_txns }}</p>
								</template>

								<template #empty-state>
									<div class="flex flex-col items-center justify-center py-6">
										<span class="text-sm text-gray-500">No items found</span>
									</div>
								</template>
							</UTable>
						</div>
					</div>
				</UCard>
			</div>

			<!-- Pagination -->
			<div v-if="data.length > 0" class="mt-6 flex justify-center">
				<UPagination
					v-model="current_page"
					:page-count="sale_summ_payments.page_size"
					:total="sale_summ_payments.total_data"
					@update:model-value="updatePage"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SaleStatus, getFormattedDate } from 'wemotoo-common';
import OrderStatus from '~/components/Z/SelectMenu/OrderStatus.vue';
import { sale_summ_payment_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		label: 'Payment Reports',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/payments',
	},
];

useHead({ title: 'Wemotoo CRM - Sale Payment Summary' });

onMounted(async () => {
	await salesSummStore.getSalePaymentSummary();
});

const salesSummStore = useSummSaleStore();
const { sale_summ_payments } = storeToRefs(salesSummStore);
const current_page = computed(() => sale_summ_payments.value.current_page);

const is_loading = computed(() => sale_summ_payments.value.is_loading);
const data = computed(() => sale_summ_payments.value.data);
const selectedColumns = ref(sale_summ_payment_columns);
const columnsTable = computed(() => sale_summ_payment_columns.filter((column) => selectedColumns.value.includes(column)));

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
				acc.total_txns += item.total_txns;
				acc.total_voided_txns += item.status === OrderStatus.REFUNDED ? item.total_txns : 0;
				acc.net_amt += item.payment_amt;
				return acc;
			},
			{ total_txns: 0, total_voided_txns: 0, net_amt: 0 },
		);

		return { date, items: items, ...totals };
	});
});

const updatePage = async (page: number) => {
	sale_summ_payments.value.current_page = page;
	await salesSummStore.getSalePaymentSummary();
};

const exportSalesPaymentsToCsv = async () => {
	await salesSummStore.exportSalePaymentSummary();
};
</script>

<style scoped lang="postcss"></style>
