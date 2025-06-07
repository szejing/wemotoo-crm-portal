<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 space-y-4">
				<div class="flex overflow-hidden bg-white rounded-lg shadow-md">
					<div class="bg-yellow-400 flex items-center justify-center p-6">
						<UIcon name="i-heroicons-bell" class="text-white" size="24" />
					</div>
					<div class="flex flex-col justify-center px-6">
						<div class="font-bold text-gray-800">Dec 31, 2025</div>
						<div class="text-gray-500">EXPIRY DATE</div>
					</div>
				</div>
			</div>

			<div class="flex items-center justify-between mt-2">
				<h1 class="text-neutral-800 font-normal">
					Summary
					<span class="text-neutral-800 font-medium italic underline">{{ getFormattedDate(filterRange.startDate) }}</span>
					<span class="text-neutral-400 italic"> - </span>
					<span class="text-neutral-800 font-medium italic underline">{{ getFormattedDate(filterRange.endDate) }}</span>
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
import { getFormattedDate } from 'wemotoo-common';

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
