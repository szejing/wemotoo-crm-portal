<template>
	<UDashboardPanel id="analytics">
		<template #header>
			<UDashboardNavbar title="Analytics" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
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
				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<UIcon :name="ICONS.REPORT_ORDER" class="text-2xl text-primary-500" />
						<div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Order Analytics</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400">Track and analyze order performance</p>
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<UCard
							v-for="(navigate, index) in order_navigations"
							:key="index"
							:to="navigate.to"
							class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
						>
							<div class="flex items-start gap-4">
								<div class="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
									<UIcon :name="navigate.icon" class="text-2xl text-primary-600 dark:text-primary-400" />
								</div>
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ navigate.title }}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">{{ navigate.description }}</p>
								</div>
								<UIcon name="i-heroicons-arrow-right" class="text-gray-400 dark:text-gray-500" />
							</div>
						</UCard>
					</div>
				</div>

				<!-- Sales Analytics Section -->
				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<UIcon :name="ICONS.REPORT_SALES" class="text-2xl text-green-500" />
						<div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Sales Analytics</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400">Monitor sales trends and revenue data</p>
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<UCard
							v-for="(navigate, index) in sales_navigations"
							:key="index"
							:to="navigate.to"
							class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
						>
							<div class="flex items-start gap-4">
								<div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
									<UIcon :name="navigate.icon" class="text-2xl text-green-600 dark:text-green-400" />
								</div>
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ navigate.title }}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">{{ navigate.description }}</p>
								</div>
								<UIcon name="i-heroicons-arrow-right" class="text-gray-400 dark:text-gray-500" />
							</div>
						</UCard>
					</div>
				</div>
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
