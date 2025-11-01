<template>
	<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
		<UPageCard
			v-for="(stat, index) in baseStats"
			:key="index"
			:icon="stat.icon"
			:title="stat.title"
			:to="stat.to"
			variant="subtle"
			:ui="{
				container: 'gap-y-1.5',
				wrapper: 'items-start',
				leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
				title: 'font-normal text-muted text-xs uppercase',
			}"
			class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1 bg-white"
		>
			<div class="flex items-center gap-2">
				<span class="text-2xl font-semibold text-highlighted">
					{{ stat.value }}
				</span>
			</div>
		</UPageCard>
	</UPageGrid>
</template>

<script setup lang="ts">
import { GROUP_CODE, MERCHANT, getFormattedDate } from 'wemotoo-common';

const merchantInfoStore = useMerchantInfoStore();
const summOrderStore = useSummOrderStore();
const { new_customers, new_orders, total_sales_amt } = storeToRefs(summOrderStore);

const expiredDate = computed(() => {
	const date = merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.EXPIRED_DATE)?.getString() ?? '';

	if (date) {
		return getFormattedDate(new Date(date), 'MMM dd, yyyy');
	}

	return '-';
});

const baseStats = computed(() => [
	{
		title: 'Customers',
		icon: 'i-lucide-users',
		value: new_customers.value ?? 0,
		to: '/customers',
	},
	{
		title: 'Orders',
		icon: 'i-lucide-shopping-cart',
		value: new_orders.value ?? 0,
		to: '/orders',
	},
	{
		title: 'Revenue',
		icon: 'i-lucide-dollar-sign',
		formatter: formatCurrency,
		value: total_sales_amt.value ?? 0,
		to: '/analytics',
	},
	{
		title: 'Expiry',
		icon: 'i-lucide-calendar',
		value: expiredDate.value ?? '-',
	},
]);
</script>
