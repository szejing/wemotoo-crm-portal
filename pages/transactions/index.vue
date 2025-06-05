<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterSales />
			<UCard class="mt-4">
				<div class="flex-jbetween-icenter">
					<div class="flex gap-4">
						<!-- <UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton> -->

						<!-- <UButton color="green" @click="navigateTo('/orders/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton> -->
					</div>

					<div class="flex gap-4">
						<span class="section-page-size">
							<USelect v-model="filter.page_size" :options="options_page_size" @update:model-value="updatePageSize" />
						</span>

						<ZSelectMenuTableColumns :columns="sale_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</div>

				<UTable :rows="rows" :columns="columnsTable" :loading="is_loading" @select="selectSale">
					<template #index-data="{ index }">
						<p>{{ index + 1 }}.</p>
					</template>

					<template #biz_date-data="{ row }">
						<p v-if="row.biz_date">{{ getFormattedDate(new Date(row.biz_date)) }}</p>
					</template>

					<template #currency_code-data="{ row }">
						<p>{{ row.currency_code }}</p>
					</template>

					<template #status-data="{ row }">
						<UBadge v-if="row.status === SaleStatus.COMPLETED" variant="outline" color="green">COMPLETED</UBadge>
						<UBadge v-else-if="row.status === SaleStatus.REFUNDED" variant="outline" color="main">REFUNDED</UBadge>
						<UBadge v-else-if="row.status === SaleStatus.CANCELLED" variant="outline" color="red">CANCELLED</UBadge>
					</template>

					<template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #gross_amt-data="{ row }">
						<p>{{ row.gross_amt.toFixed(2) }}</p>
					</template>

					<template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #net_amt-data="{ row }">
						<p>{{ row.net_amt.toFixed(2) }}</p>
					</template>

					<template #disc_amt-header>
						<p>
							Disc Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #disc_amt-data="{ row }">
						<p>{{ row.disc_amt.toFixed(2) }}</p>
					</template>

					<template #void_amt-header>
						<p>
							Void Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template>

					<template #void_amt-data="{ row }">
						<p>{{ row.void_amt.toFixed(2) }}</p>
					</template>

					<template #total_qty-data="{ row }">
						<p>{{ row.total_order_qty }}</p>
					</template>

					<template #total_voided_qty-data="{ row }">
						<p v-if="row.voided_qty">{{ row.voided_qty }}</p>
						<p v-else>0</p>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Sales !</span>
						</div>
					</template>
				</UTable>

				<div v-if="transactions.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="filter.page_size" :total="transactions.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SaleStatus, getFormattedDate } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { sale_columns } from '~/utils/table-columns';
import type { Transaction } from '~/repository/modules/sale/models/response/transaction';

const links = [
	{
		label: 'Transactions',
		icon: ICONS.ORDER,
		to: '/',
	},
	{
		label: 'All Transactions',
		icon: ICONS.LIST,
		to: '/products',
	},
];

const page = ref(1);
const saleStore = useSaleStore();
const { transactions, filter } = storeToRefs(saleStore);

const currency_code = ref(filter.value.currency_code);
const is_loading = computed(() => saleStore.loading);

const selectedColumns = ref(sale_columns);
const columnsTable = computed(() => sale_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: { key: string; label: string; sortable?: boolean }[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return transactions.value.slice((page.value - 1) * filter.value.page_size, page.value * filter.value.page_size);
});

const updatePageSize = async (size: number) => {
	filter.value.page_size = size;
	await saleStore.getTransactions();
};

const selectSale = (row: Transaction) => {
	navigateTo(`/transactions/detail/${row.bill_no}`);
};
</script>

<style scoped lang="postcss"></style>
