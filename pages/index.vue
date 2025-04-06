<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<div class="grid grid-cols-1">
				<DashboardChartSummOrders />
			</div>
			<!-- <div class="grid grid-cols-3 mt-4 gap-4">
				<DashboardChartSales class="col-span-1" />
				<DashboardChartProducts class="col-span-1" />
				<DashboardChartVisitors class="col-span-1" />
			</div> -->
		</div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Overview',
		icon: ICONS.DASHBOARD_ROUNDED,
		to: '/',
	},
];
</script>

<style scoped lang="postcss"></style>
