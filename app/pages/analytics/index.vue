<template>
	<UDashboardPanel id="analytics">
		<template #header>
			<UDashboardNavbar :title="$t('nav.analytics')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('pages.analyticsDashboard') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.analyticsDashboardDesc') }}</p>
				</div>

				<!-- Order Analytics Section -->
				<ZMenu
					:title="$t('pages.orderAnalytics')"
					:icon="ICONS.REPORT_ORDER"
					:description="$t('pages.orderAnalyticsDesc')"
					color="primary"
					:navigations="order_navigations"
				/>

				<!-- Sales Analytics Section -->
				<ZMenu
					:title="$t('pages.salesAnalytics')"
					:icon="ICONS.REPORT_SALES"
					:description="$t('pages.salesAnalyticsDesc')"
					color="green"
					:navigations="sales_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({ title: () => t('pages.analyticsTitle') });

const order_navigations = computed(() => [
	{
		title: t('pages.orderSummary'),
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/summary',
		description: t('pages.orderSummaryDesc'),
	},
	{
		title: t('pages.orderItem'),
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/items',
		description: t('pages.orderItemDesc'),
	},
	{
		title: t('pages.orderCustomer'),
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/customers',
		description: t('pages.orderCustomerDesc'),
	},
]);

const sales_navigations = computed(() => [
	{
		title: t('pages.salesSummary'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/summary',
		description: t('pages.salesSummaryDesc'),
	},
	{
		title: t('pages.salesItems'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/items',
		description: t('pages.salesItemsDesc'),
	},
	{
		title: t('pages.salesPayment'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/payments',
		description: t('pages.salesPaymentDesc'),
	},
	{
		title: t('pages.salesCustomer'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/customers',
		description: t('pages.salesCustomerDesc'),
	},
]);
</script>

<style scoped></style>
