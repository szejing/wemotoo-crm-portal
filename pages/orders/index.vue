<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
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

				<UTable :rows="rows" :columns="columnsTable" :loading="is_loading" @select="selectOrder">
					<template #biz_date-data="{ row }">
						<p v-if="row.biz_date">{{ getFormattedDate(new Date(row.biz_date)) }}</p>
					</template>

					<template #currency_code-data="{ row }">
						<p>{{ row.currency_code }}</p>
					</template>

					<template #order_status-data="{ row }">
						<UBadge v-if="row.order_status === OrderStatus.COMPLETED" variant="outline" color="green">COMPLETED</UBadge>
						<UBadge v-else-if="row.order_status === OrderStatus.PENDING_PAYMENT" variant="outline" color="main">PAYMENT REQUIRED</UBadge>
						<UBadge v-else-if="row.order_status === OrderStatus.REFUNDED" variant="outline" color="red">REFUNDED</UBadge>
						<UBadge v-else-if="row.order_status === OrderStatus.CANCELLED" variant="outline" color="gray">CANCELLED</UBadge>
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
							<span class="italic text-sm">No Orders !</span>
						</div>
					</template>
				</UTable>

				<div v-if="orders.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="filter.page_size" :total="orders.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { OrderStatus, getFormattedDate, removeMerchantId } from 'wemotoo-common';
import { useOrderStore } from '~/stores/Order/Order';
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

const page = ref(1);
const orderStore = useOrderStore();
const { orders, filter } = storeToRefs(orderStore);

const currency_code = ref(filter.value.currency_code);
const is_loading = computed(() => orderStore.loading);

const selectedColumns = ref(order_columns);
const columnsTable = computed(() => order_columns.filter((column) => selectedColumns.value.includes(column)));

const updateColumns = (columns: string[]) => {
	selectedColumns.value = columns;
};

const rows = computed(() => {
	return orders.value.slice((page.value - 1) * filter.value.page_size, page.value * filter.value.page_size);
});

const updatePageSize = async (size: number) => {
	filter.value.page_size = size;
	await orderStore.getOrders();
};

const selectOrder = (row: Order) => {
	navigateTo(`/orders/detail/${removeMerchantId(row.order_no)}`);
};
</script>

<style scoped lang="postcss"></style>
