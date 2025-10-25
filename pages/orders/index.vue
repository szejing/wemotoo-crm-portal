<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterOrders />
			<UCard class="mt-4">
				<div class="flex-jbetween-icenter">
					<div class="gap-4 hidden sm:flex sm:w-1/2">
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

					<div class="flex gap-4">
						<span class="section-page-size">
							<USelect v-model="filter.page_size" :options="options_page_size" @update:model-value="updatePageSize" />
						</span>

						<UButton :disabled="exporting" :loading="exporting" @click="exportOrders">
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<!-- <ZSelectMenuTableColumns :columns="order_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" /> -->
					</div>
				</div>

				<UTable :rows="rows" :columns="columnsTable" :loading="loading" class="mt-4" @select="selectOrder">
					<template #index-data="{ index }">
						<p class="text-left">{{ index + 1 }}.</p>
					</template>

					<template #biz_date-data="{ row }">
						<p v-if="row.biz_date" class="text-left">{{ row.biz_date }}</p>
					</template>

					<template #order_no-data="{ row }">
						<p class="text-center">{{ row.transaction_no }}</p>
					</template>

					<template #currency_code-data="{ row }">
						<p class="text-center">{{ row.currency_code }}</p>
					</template>

					<template #status-data="{ row }">
						<div class="flex justify-center">
							<UBadge v-if="row.status === OrderStatus.PENDING_PAYMENT" variant="subtle" color="cyan">PENDING PAYMENT</UBadge>
							<UBadge v-else-if="row.status === OrderStatus.PROCESSING" color="sky">PROCESSING</UBadge>
							<UBadge v-else-if="row.status === OrderStatus.COMPLETED" color="green">COMPLETED</UBadge>
							<UBadge v-else-if="row.status === OrderStatus.REQUIRES_ACTION" color="yellow">REQUIRES ACTION</UBadge>
							<UBadge v-else-if="row.status === OrderStatus.REFUNDED" color="red">REFUNDED</UBadge>
							<UBadge v-else-if="row.status === OrderStatus.CANCELLED" color="red">CANCELLED</UBadge>
						</div>
					</template>

					<template #total_qty-data="{ row }">
						<p class="text-center">{{ row.total_qty }}</p>
					</template>
					<!-- <template #gross_amt-header>
						<p>
							Gross Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #gross_amt-data="{ row }">
						<p class="text-center">{{ row.gross_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #net_amt-header>
						<p>
							Net Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #net_amt-data="{ row }">
						<p class="text-center">{{ row.net_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #disc_amt-header>
						<p>
							Disc Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #disc_amt-data="{ row }">
						<p class="text-center">{{ row.disc_amt.toFixed(2) }}</p>
					</template>

					<!-- <template #tax_amt_exc-header>
						<p>
							Tax Amt Exc <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<template #tax_amt_exc-data="{ row }">
						<p class="text-center">{{ row.tax_amt_exc.toFixed(2) }}</p>
					</template>

					<!-- <template #void_amt-header>
						<p>
							Void Amt <span class="italic text-gray-500">({{ currency_code }})</span>
						</p>
					</template> -->

					<!-- <template #void_amt-data="{ row }">
						<p>{{ row.void_amt.toFixed(2) }}</p>
					</template> -->

					<template #total_voided_qty-data="{ row }">
						<p v-if="row.voided_qty" class="text-center">{{ row.voided_qty }}</p>
						<p v-else class="text-center">0</p>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Orders !</span>
						</div>
					</template>
				</UTable>

				<div v-if="orders.length > 0" class="section-pagination">
					<UPagination v-model="current_page" :page-count="filter.page_size" :total="orders.length" @update:model-value="updatePage" />
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

useHead({ title: 'Wemotoo CRM - Orders' });

const orderStore = useOrderStore();
const { orders, filter, loading, exporting } = storeToRefs(orderStore);

const current_page = computed(() => filter.value.current_page);

const selectedTab = ref(0);

const tabItems = [
	{
		label: 'All',
		value: 'all',
	},
	{
		label: 'Pending',
		value: 'pending',
	},
	{
		label: 'Completed',
		value: 'completed',
	},
	{
		label: 'Cancelled',
		value: 'cancelled',
	},
];

const selectedColumns = ref(order_columns);
const columnsTable = computed(() => order_columns.filter((column) => selectedColumns.value.includes(column)));

const rows = computed(() => {
	return orders.value.slice((current_page.value - 1) * filter.value.page_size, current_page.value * filter.value.page_size);
});

const selectTab = async (index: number) => {
	selectedTab.value = index;
	filter.value.current_page = 1;
	filter.value.status = tabItems[index].value as OrderStatus;
	await orderStore.getOrders();
};

const updatePageSize = async (size: number) => {
	filter.value.page_size = size;
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

<style scoped lang="postcss"></style>
