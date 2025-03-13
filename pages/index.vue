<template>
	<div>
		<UBreadcrumb :items="links" />
		<div class="container">
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 md:grid-rows-2 gap-4">
				<DashboardChartSales class="col-span-1 sm:col-span-2 sm:row-span-2 md:col-span-4" />
				<DashboardChartProducts class="col-span-1 sm:col-span-2 md:col-span-2" />
				<DashboardChartVisitors class="col-span-1 sm:col-span-2 md:col-span-2" />
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

<style scoped lang="css"></style>
