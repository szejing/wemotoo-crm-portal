<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterOrders />
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

						<ZSelectMenuTableColumns :columns="order_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" />
					</div>
				</div>

				<UTable :rows="rows" :columns="columnsTable" :loading="loading" @select="selectOrder">
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
						<UBadge v-if="row.status === OrderStatus.NEW" variant="outline" color="green">NEW</UBadge>
						<UBadge v-if="row.status === OrderStatus.COMPLETED" variant="outline" color="green">COMPLETED</UBadge>
						<UBadge v-else-if="row.status === OrderStatus.REFUNDED" variant="outline" color="main">REFUNDED</UBadge>
						<UBadge v-else-if="row.status === OrderStatus.CANCELLED" variant="outline" color="red">CANCELLED</UBadge>
					</template>

					<!-- <template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #gross_amt-data="{ row }">
						<p>{{ row.gross_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #net_amt-data="{ row }">
						<p>{{ row.net_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #disc_amt-header>
						<p>
							Disc Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #disc_amt-data="{ row }">
						<p>{{ row.disc_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #tax_amt_exc-header>
						<p>
							Tax Amt Exc <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #tax_amt_exc-data="{ row }">
						<p>{{ row.tax_amt_exc.toFixed(2) }}</p>
					</template>

					<!-- <template #void_amt-header>
						<p>
							Void Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

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
							<span class="italic text-sm">No Orders !</span>
						</div>
					</template>
				</UTable>

				<div v-if="orders.length > 0" class="section-pagination">
					<UPagination v-model="current_page" :page-count="filter.page_size" :total="total_orders" @update:model-value="updatePage" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { OrderStatus, getFormattedDate } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { order_columns } from '~/utils/table-columns';
import type { Order } from '~/utils/types/order';

const links = [
	{
		label: 'Orders',
		icon: ICONS.ORDER,
		to: '/',
	},
	{
		label: 'All Orders',
		icon: ICONS.LIST,
		to: '/products',
	},
];

const orderStore = useOrderStore();
const { orders, filter, total_orders, loading } = storeToRefs(orderStore);

const current_page = computed(() => filter.value.current_page);

const selectedColumns = ref(order_columns);
const columnsTable = computed(() => order_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: { key: string; label: string; sortable?: boolean }[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return orders.value.slice((current_page.value - 1) * filter.value.page_size, current_page.value * filter.value.page_size);
});

const updatePageSize = async (size: number) => {
	filter.value.page_size = size;
	await orderStore.getOrders();
};

const updatePage = async (page: number) => {
	filter.value.current_page = page;
	await orderStore.getOrders();
};

const selectOrder = (row: Order) => {
	navigateTo(`/orders/detail/${encodeURIComponent(row.order_no)}`);
};
</script>

<style scoped lang="postcss"></style>
