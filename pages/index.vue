<template>
	<div>
		<UBreadcrumb :items="links" />
		<div class="container">
			<div class="flex items-center justify-between">
				<h1 class="text-neutral-800 font-normal">
					Summary
					<span class="text-neutral-800 font-medium italic">{{ extractDate(filterRange.startDate) }}</span>
					<span class="text-neutral-400 italic"> to </span>
					<span class="text-neutral-800 font-medium italic">{{ extractDate(filterRange.endDate) }}</span>
				</h1>
				<ZSelectMenuDateRange
					:start-date="filterRange.startDate"
					:end-date="filterRange.endDate"
					@update:start-date="updateStartDate"
					@update:end-date="updateEndDate"
				/>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
				<ChartSummOrders class="col-span-1 sm:col-span-2 sm:row-span-2" />
				<ChartCustomers class="col-span-1" />
				<ChartProducts class="col-span-1" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { extractDate } from 'wemotoo-common';

const links = [
	{
		label: 'Overview',
		icon: ICONS.DASHBOARD_ROUNDED,
		to: '/',
	},
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const last7Days = new Date(today);
last7Days.setDate(today.getDate() - 7);

const filterRange = ref({
	startDate: last7Days,
	endDate: today,
});

const updateStartDate = (startDate: Date) => {
	filterRange.value.startDate = startDate;
};

const updateEndDate = async (endDate: Date) => {
	filterRange.value.endDate = endDate;

	const summOrderStore = useSummOrderStore();
	await summOrderStore.getDashboardSummary(filterRange.value.startDate, filterRange.value.endDate);
};
</script>

<style scoped lang="postcss"></style>
