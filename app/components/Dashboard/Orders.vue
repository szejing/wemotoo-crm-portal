<template>
	<div class="mt-4 rounded-lg">
		<UCard
			:ui="{
				header: 'bg-elevated/40 px-4 py-3 sm:px-6',
				body: 'p-0 sm:p-0',
			}"
		>
			<template #header>
				<h1 class="text-lg font-bold">{{ $t('nav.orders') }}</h1>
			</template>

			<UTable :data="orders" :columns="order_columns" :loading="loading" @select="selectOrder">
				<template #empty>
					<div class="flex flex-col items-center justify-center py-6 gap-3">
						<span class="italic text-sm">{{ $t('pages.noOrdersFound') }}</span>
					</div>
				</template>
			</UTable>
		</UCard>
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

	navigateTo(`/orders/${encodeURIComponent(order.order_no)}?type=${order.type}`);
};
</script>

<style scoped></style>
