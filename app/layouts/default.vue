<template>
	<UDashboardGroup>
		<UDashboardSidebar id="default" v-model:open="showSidebar" collapsible resizable class="bg-elevated/25" :ui="{ footer: 'lg:border-t lg:border-default' }">
			<template #header="{ collapsed }">
				<SidebarHeader :collapsed="collapsed" />
			</template>

			<!-- Grouped Navigation Sections -->
			<template #default="{ collapsed }">
				<template v-for="nav in navigations" :key="nav.label">
					<UNavigationMenu :collapsed="collapsed" :items="nav.links" orientation="vertical" tooltip popover />
				</template>
			</template>

			<template #footer="{ collapsed }">
				<ZUserMenu :collapsed="collapsed" />
			</template>
		</UDashboardSidebar>
		<slot />
	</UDashboardGroup>
</template>

<script lang="ts" setup>
const appUiStore = useAppUiStore();
const { navigations, showSidebar } = storeToRefs(appUiStore);
</script>
