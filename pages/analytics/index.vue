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
			<div>
				<h3>Order Analytics</h3>
				<ZMenu :navigations="order_navigations" class="mt-4" />
			</div>

			<div>
				<h3>Sales Analytics</h3>
				<ZMenu :navigations="sales_navigations" class="mt-4" />
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
	},
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
	// {
	// 	title: 'Sales Detail Listing',
	// 	icon: ICONS.REPORT_SALES,
	// 	to: '/analytics/sales/detail-listing',
	// },
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

<style scoped></style>
