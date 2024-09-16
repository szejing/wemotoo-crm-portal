<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<div class="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-4">
				<DashboardChartSales class="col-span-1 sm:col-span-3 sm:row-span-2" />
				<DashboardChartProducts class="col-span-1" />
				<DashboardChartVisitors class="col-span-1" />
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
		icon: 'i-material-symbols-light-dashboard-outline-rounded',
		to: '/',
	},
];
</script>

<style scoped lang="css"></style>
