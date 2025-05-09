<template>
	<UCard
		:ui="{
			base: 'flex flex-col h-full',
			body: {
				base: 'flex-1',
			},
			footer: {
				base: 'items-end mt-auto mb-2',
			},
		}"
	>
		<template #header>
			<div class="w-full flex justify-between items-center">
				<h2>Order</h2>
			</div>
		</template>
		<Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
		<template #footer>
			<div class="w-full flex justify-end items-center text-secondary-400 gap-2">
				<p class="text-sm text-end">Details</p>
				<UIcon :name="ICONS.LIGHT_CHEVRON_RIGHT" class="w-6 h-6" />
			</div>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const summOrderStore = useSummOrderStore();
const { daily_summaries } = storeToRefs(summOrderStore);

const chartData = computed(() => {
	return {
		labels:
			daily_summaries.value.length > 30
				? daily_summaries.value.map((summary) => summary.summ_order.biz_date)
				: daily_summaries.value.map((summary) => summary.summ_order.biz_date),
		datasets: [
			{
				barThickness: 12,
				maxBarThickness: 14,
				minBarLength: 2,
				label: 'Total Orders',
				data: daily_summaries.value.map((summary) => summary.summ_order.total_orders),
				backgroundColor: '#F79D65',
				borderColor: '#FCDCC8',
				borderWidth: 1,
				fill: false,
			},
		],
	};
});

const chartOptions = {
	responsive: true,
	scales: {
		y: {
			beginAtZero: true,
			suggestedMin: 1,
			suggestedMax: 10,
		},
	},
};
</script>

<style scoped lang="postcss"></style>
