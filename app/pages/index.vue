<template>
	<UDashboardPanel id="home">
		<template #header>
			<UDashboardNavbar :title="$t('pages.home')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
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
useHead({ title: 'Wemotoo CRM' });
</script>
