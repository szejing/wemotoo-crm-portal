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
							<USelect v-model="filter.page_size" :items="options_page_size" @update:model-value="updatePageSize" />
						</span>

						<UButton :disabled="exporting" :loading="exporting" @click="exportOrders">
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<!-- <ZSelectMenuTableColumns :columns="order_columns" :selected-columns="selectedColumns" @update:columns="updateColumns" /> -->
					</div>
				</div>

				<UTable :data="rows" :columns="order_columns" :loading="loading" class="mt-4" @select-row="selectOrder">
					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Orders !</span>
						</div>
					</template>
				</UTable>

				<div v-if="orders.length > 0" class="section-pagination">
					<UPagination :default-page="current_page" :items-per-page="filter.page_size" :total="orders.length" @update:page="updatePage" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { OrderStatus } from 'wemotoo-common';
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

// const selectedColumns = ref(order_columns);
// const columnsTable = computed(() => order_columns.filter((column) => selectedColumns.value.includes(column)));

const rows = computed(() => {
	return orders.value.slice((current_page.value - 1) * filter.value.page_size, current_page.value * filter.value.page_size);
});

const selectTab = async (index: number) => {
	selectedTab.value = index;
	filter.value.current_page = 1;
	filter.value.status = tabItems[index]?.value as OrderStatus;
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

<style scoped></style>
