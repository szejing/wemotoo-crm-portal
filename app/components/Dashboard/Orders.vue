<template>
	<div class="mt-4 p-4 rounded-lg">
		<h1 class="text-lg font-bold">{{ $t('nav.orders') }}</h1>
		<UTable :data="orders" :columns="order_columns" :loading="loading" @select="selectOrder">
			<template #empty>
				<div class="flex flex-col items-center justify-center py-6 gap-3">
					<span class="italic text-sm">{{ $t('pages.noOrdersFound') }}</span>
				</div>
			</template>
		</UTable>
	</div>
</template>

<script lang="ts" setup>
import { getOrderColumns } from '~/utils/table-columns';
import type { TableRow } from '@nuxt/ui';
import type { OrderHistory } from '~/utils/types/order-history';

const { t } = useI18n();
const order_columns = computed(() => getOrderColumns(t));

const orderStore = useOrderStore();
const { orders, loading } = storeToRefs(orderStore);

const selectOrder = (e: Event, row: TableRow<OrderHistory>) => {
	const order = row.original;
	if (!order) return;

	navigateTo(`/orders/detail/${encodeURIComponent(order.order_no)}`);
};
</script>

<style scoped></style>
