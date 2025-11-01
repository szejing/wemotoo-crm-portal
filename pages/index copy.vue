<template>
	<UDashboardPage>
		<UDashboardPanel grow>
			<UDashboardNavbar>
				<template #left>
					<UBreadcrumb :links="links" />
				</template>
			</UDashboardNavbar>

			<UDashboardSection title="Metrics Overview" description="Track your business performance">
				<DashboardMetricsOverview />
			</UDashboardSection>

			<UDashboardSection>
				<template #title>
					<div class="flex items-center justify-between w-full">
						<h2 class="text-neutral-800 font-normal">
							Summary
							<span class="text-neutral-800 font-medium italic underline">{{ getFormattedDate(filterRange.startDate) }}</span>
							<span class="text-neutral-400 italic"> - </span>
							<span class="text-neutral-800 font-medium italic underline">{{ getFormattedDate(filterRange.endDate) }}</span>
						</h2>
						<ZSelectMenuDatePreset
							:start-date="filterRange.startDate"
							:end-date="filterRange.endDate"
							@update:start-date="updateStartDate"
							@update:end-date="updateEndDate"
						/>
					</div>
				</template>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
					<ChartSummOrders class="col-span-1 sm:col-span-2 sm:row-span-2" />
					<ChartCustomers class="col-span-1" />
					<ChartProducts class="col-span-1" />
				</div>
			</UDashboardSection>
		</UDashboardPanel>
	</UDashboardPage>
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

useHead({ title: 'Wemotoo CRM - Dashboard' });

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

<style scoped></style>
