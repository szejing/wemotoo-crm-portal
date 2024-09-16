<template>
	<UCard>
		<template #header>
			<div class="w-full">
				<h1 class="font-nunito font-semibold text-xl text-secondary-600">Sales</h1>
			</div>
		</template>
		<Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
		<template #footer>
			<div class="w-full flex justify-end items-center text-secondary-400 gap-2">
				<p class="font-nunito text-sm text-end">Details</p>
				<UIcon name="i-material-symbols-light-chevron-right-rounded" class="w-6 h-6" />
			</div>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = {
	labels: ['January', 'February', 'March'],
	datasets: [{ data: [40, 20, 12] }],
};

const chartOptions = {
	responsive: true,
};
</script>

<style scoped lang="css"></style>
