<template>
	<div class="space-y-8">
		<UContainer class="space-y-4">
			<h6 class="font-bold">Order Report</h6>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 space-y-4">
				<UButton v-for="(navigate, index) in order_navigations" :key="index" variant="ghost" color="gray" :to="navigate.to">
					<div class="flex flex-col items-center gap-2 mx-auto text-center">
						<UIcon size="24" :name="navigate.icon" />
						<span>{{ navigate.title }}</span>
					</div>
				</UButton>
			</div>
		</UContainer>

		<UContainer class="space-y-4 mt-8">
			<h6 class="font-bold">Sales Report</h6>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 space-y-4">
				<UButton v-for="(navigate, index) in sales_navigations" :key="index" variant="ghost" color="gray" :to="navigate.to">
					<div class="flex flex-col items-center gap-2 mx-auto text-center">
						<UIcon size="24" :name="navigate.icon" />
						<span>{{ navigate.title }}</span>
					</div>
				</UButton>
			</div>
		</UContainer>
	</div>
</template>

<script lang="ts" setup>
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
