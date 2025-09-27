<template>
	<div class="space-y-8">
		<div>
			<h2 class="font-bold">Order Report</h2>
			<ZMenu :navigations="order_navigations" />
		</div>

		<div class="mt-8">
			<h2 class="font-bold">Sales Report</h2>
			<ZMenu :navigations="sales_navigations" />
		</div>
	</div>
</template>

<script lang="ts" setup>
useHead({ title: 'Wemotoo CRM - Analytics' });

const order_navigations = [
	{
		title: 'Order Summary',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/summary',
	},
	// {
	// 	title: 'Order Detail Listing',
	// 	icon: ICONS.REPORT_ORDER,
	// 	to: '/analytics/orders/detail-listing',
	// },
	{
		title: 'Order Item',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/items',
	},
	{
		title: 'Order Customer',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/customers',
	},
];

const sales_navigations = [
	{
		title: 'Sales Summary',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/summary',
	},
	{
		title: 'Sales Detail Listing',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/detail-listing',
	},
	{
		title: 'Sales Items',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/items',
	},
	{
		title: 'Sales Payment',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/payments',
	},
	{
		title: 'Sales Customer',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/customers',
	},
];
</script>

<style scoped lang="postcss"></style>
