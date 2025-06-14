<template>
	<UCard
		:ui="{
			base: 'flex flex-col h-full',
			header: {
				base: 'pt-4',
			},
			body: {
				base: 'flex-1',
			},
			footer: {
				base: 'items-end mt-auto mb-2',
			},
		}"
	>
		<template #header>
			<div class="w-full">
				<h2>Top Customers</h2>
			</div>
		</template>

		<div class="flex-1 flex items-center justify-center">
			<Pie :data="chartData" :options="chartOptions" />
		</div>

		<template #footer>
			<div class="w-full flex justify-end items-center text-secondary-400 gap-2">
				<p class="text-sm text-end">Details</p>
				<UIcon :name="ICONS.LIGHT_CHEVRON_RIGHT" class="w-6 h-6" />
			</div>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const summOrderStore = useSummOrderStore();
const { top_purchased_customers } = storeToRefs(summOrderStore);

// Chart data configuration
const chartData = computed(() => ({
	labels: top_purchased_customers.value.map((cust) => cust.customer_name),
	datasets: [
		{
			data: top_purchased_customers.value.map((cust) => cust.total_orders),
			backgroundColor: ['#00356780', '#FAC7A780', '#00122280', '#F3732380', '#BFCEDC80'],
			borderColor: ['#001222', '#F37323', '#BFCEDC', '#FAC7A7', '#003567'],
			borderWidth: 1,
		},
	],
}));

// Chart options configuration
const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'bottom' as const,
			labels: {
				padding: 20,
				usePointStyle: true,
			},
		},
		tooltip: {
			callbacks: {
				label: (context: any) => {
					const label = context.label || '';
					const value = context.parsed || 0;
					return `${label}: ${value} orders`;
				},
			},
		},
	},
}));
</script>

<style scoped lang="postcss"></style>
