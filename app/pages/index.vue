<template>
	<UDashboardPanel id="home">
		<template #header>
			<UDashboardNavbar :title="$t('pages.home')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
				<template #right>
					<DashboardDateRange v-model="dashboardRange" @update:model-value="onDashboardRangeChange" />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<DashboardStats />
			<DashboardOrderAmtChart />
			<DashboardOrders />
		</template>
	</UDashboardPanel>
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
