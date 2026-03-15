<template>
	<ZPagePanel id="home" :title="$t('pages.home')">
		<ZDateRange v-model="dashboardRange" @update:model-value="onDashboardRangeChange" />
		<DashboardStats />
		<!-- <DashboardOrderAmtChart /> -->
		<DashboardOrders />
	</ZPagePanel>
</template>

<script setup lang="ts">
import { startOfWeek, endOfWeek } from 'date-fns';
import type { Range } from '~/utils/interface';

useHead({ title: 'Wemotoo CRM' });

const summOrderStore = useSummOrderStore();

const dashboardRange = ref<Range>({
	start: startOfWeek(new Date(), { weekStartsOn: 1 }),
	end: endOfWeek(new Date(), { weekStartsOn: 1 }),
});

async function onDashboardRangeChange(range: Range) {
	await summOrderStore.getDashboardSummary(range);
}

onMounted(() => {
	summOrderStore.getDashboardSummary(dashboardRange.value);
});
</script>
