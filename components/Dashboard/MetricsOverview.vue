<template>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
		<div class="flex overflow-hidden bg-white rounded-lg shadow-md cursor-pointer">
			<div class="bg-main-500 flex items-center justify-center p-6">
				<UIcon :name="ICONS.CUSTOMER_PLUS" class="text-white" size="24" />
			</div>
			<div class="flex flex-col justify-center px-6 text-main-500 min-w-0 flex-1">
				<p class="font-bold text-main-500 text-sm">New Customers</p>
				<h3 class="font-bold text-lg truncate">{{ new_customers }}</h3>
			</div>
		</div>

		<div class="flex overflow-hidden bg-white rounded-lg shadow-md cursor-pointer">
			<div class="bg-main-500 flex items-center justify-center p-6">
				<UIcon :name="ICONS.ORDER" class="text-white" size="24" />
			</div>
			<div class="flex flex-col justify-center px-6 text-main-500 min-w-0 flex-1">
				<p class="font-bold text-main-500 text-sm">New Orders</p>
				<h3 class="font-bold text-lg truncate">{{ new_orders }}</h3>
			</div>
		</div>

		<div class="flex overflow-hidden bg-white rounded-lg shadow-md cursor-pointer">
			<div class="bg-secondary-500 flex items-center justify-center p-6">
				<UIcon :name="ICONS.REPORT_SALES" class="text-white" size="24" />
			</div>
			<div class="flex flex-col justify-center px-6 text-secondary-500 min-w-0 flex-1">
				<p class="font-bold text-secondary-500 text-sm">Total Sales Amt</p>
				<h3 class="font-bold text-lg truncate">RM {{ total_sales_amt.toFixed(2) }}</h3>
			</div>
		</div>

		<div class="flex overflow-hidden bg-white rounded-lg shadow-md cursor-pointer">
			<div class="bg-secondary-500 flex items-center justify-center p-6">
				<UIcon :name="ICONS.CALENDAR" class="text-white" size="24" />
			</div>
			<div class="flex flex-col justify-center px-6 text-secondary-500 min-w-0 flex-1">
				<p class="font-bold text-secondary-500 text-sm">Expiry Date</p>
				<h3 class="font-bold text-lg truncate">{{ expiredDate }}</h3>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { getFormattedDate, GROUP_CODE, MERCHANT } from 'wemotoo-common';

const merchantInfoStore = useMerchantInfoStore();
const summOrderStore = useSummOrderStore();
const { new_customers, new_orders, total_sales_amt } = storeToRefs(summOrderStore);

const expiredDate = computed(() => {
	const date = merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.EXPIRED_DATE)?.getString() ?? '';

	return getFormattedDate(new Date(date), 'MMM dd, yyyy');
});
</script>

<style></style>
