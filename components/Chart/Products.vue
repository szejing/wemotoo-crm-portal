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
				base: 'items-end mt-auto  mb-2',
			},
		}"
	>
		<template #header>
			<div class="w-full">
				<h2>Top Products</h2>
			</div>
		</template>

		<div class="flex-1 flex items-center justify-center min-h-[150px]">
			<Doughnut v-if="top_purchased_products.length > 0" :data="chartData" :options="chartOptions" />
			<div v-else class="flex items-center justify-center h-full">
				<p class="text-neutral-400">No data</p>
			</div>
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
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const summOrderStore = useSummOrderStore();
const { top_purchased_products } = storeToRefs(summOrderStore);

// Chart data configuration
const chartData = computed(() => ({
	labels: top_purchased_products.value.map((product) => product.prod_code),
	datasets: [
		{
			data: top_purchased_products.value.map((product) => product.total_qty),
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
					return `${label}: ${value} qty`;
				},
			},
		},
	},
}));
</script>

<style scoped lang="postcss"></style>
