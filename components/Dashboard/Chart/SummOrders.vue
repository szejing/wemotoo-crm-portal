<template>
	<UCard>
		<template #header>
			<div class="w-full flex justify-between items-center">
				<h1>Order Summary</h1>
				<ZSelectMenuDateRange
					:start-date="filterRange.startDate"
					:end-date="filterRange.endDate"
					@update:start-date="updateStartDate"
					@update:end-date="updateEndDate"
				/>
			</div>
		</template>
		<Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
		<template #footer>
			<div class="w-full flex justify-end items-center text-secondary-400 gap-2">
				<p class="text-sm text-end">Details</p>
				<UIcon :name="ICONS.CHEVRON_RIGHT" class="w-6 h-6" />
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

const today = new Date();
today.setHours(0, 0, 0, 0);

const last7Days = new Date(today);
last7Days.setDate(today.getDate() - 7);

const filterRange = ref({
	startDate: last7Days,
	endDate: today,
});

const chartData = computed(() => {
	return {
		labels: daily_summaries.value.map((summary) => summary.summ_order.biz_date),
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

const updateStartDate = (startDate: Date) => {
	filterRange.value.startDate = startDate;
};

const updateEndDate = async (endDate: Date) => {
	filterRange.value.endDate = endDate;
	await summOrderStore.getDashboardSummary(filterRange.value.startDate, filterRange.value.endDate);
};

onMounted(async () => {
	await summOrderStore.getDashboardSummary(filterRange.value.startDate, filterRange.value.endDate);
});
</script>

<style scoped lang="postcss"></style>
