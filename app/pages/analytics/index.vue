<template>
	<UDashboardPanel id="analytics">
		<template #header>
			<UDashboardNavbar title="Analytics" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
					<p class="text-gray-600 dark:text-gray-400">View detailed reports and insights for your business</p>
				</div>

				<!-- Order Analytics Section -->
				<ZMenu
					title="Order Analytics"
					:icon="ICONS.REPORT_ORDER"
					description="Track and analyze order performance"
					color="primary"
					:navigations="order_navigations"
				/>

				<!-- Sales Analytics Section -->
				<ZMenu
					title="Sales Analytics"
					:icon="ICONS.REPORT_SALES"
					description="Monitor sales trends and revenue data"
					color="green"
					:navigations="sales_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
useHead({ title: 'Wemotoo CRM - Analytics' });

const order_navigations = [
	{
		title: 'Order Summary',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/summary',
		description: 'Overview of all orders with key metrics and trends',
	},
	{
		title: 'Order Item',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/items',
		description: 'Detailed breakdown of items in orders',
	},
	{
		title: 'Order Customer',
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/customers',
		description: 'Customer order history and behavior analysis',
	},
];

const sales_navigations = [
	{
		title: 'Sales Summary',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/summary',
		description: 'Comprehensive sales overview and revenue insights',
	},
	// {
	// 	title: 'Sales Detail Listing',
	// 	icon: ICONS.REPORT_SALES,
	// 	to: '/analytics/sales/detail-listing',
	// 	description: 'Detailed transaction listing',
	// },
	{
		title: 'Sales Items',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/items',
		description: 'Product performance and sales by item',
	},
	{
		title: 'Sales Payment',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/payments',
		description: 'Payment methods and transaction analysis',
	},
	{
		title: 'Sales Customer',
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/customers',
		description: 'Customer purchase patterns and loyalty metrics',
	},
];
</script>

<style scoped></style>
