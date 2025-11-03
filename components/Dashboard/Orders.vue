<template>
	<div class="mt-4 p-4 rounded-lg">
		<h1 class="text-lg font-bold">Orders</h1>
		<UTable :data="rows" :columns="order_columns" :loading="loading" @select-row="selectOrder">
			<template #empty-state>
				<div class="flex flex-col items-center justify-center py-6 gap-3">
					<span class="italic text-sm">No Orders !</span>
				</div>
			</template>
		</UTable>
	</div>
</template>

<script lang="ts" setup>
import { order_columns } from '~/utils/table-columns';
import type { Order } from '~/utils/types/order';

const orderStore = useOrderStore();
const { orders, filter, loading } = storeToRefs(orderStore);
const current_page = computed(() => filter.value.current_page);

const rows = computed(() => {
	return orders.value.slice((current_page.value - 1) * filter.value.page_size, current_page.value * filter.value.page_size);
});

const selectOrder = (row: Order) => {
	navigateTo(`/orders/detail/${encodeURIComponent(row.order_no)}`);
};
</script>

<style scoped></style>
