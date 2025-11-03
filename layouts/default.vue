<template>
	<UDashboardGroup>
		<UDashboardSidebar id="default" v-model:open="showSidebar" collapsible resizable class="bg-elevated/25" :ui="{ footer: 'lg:border-t lg:border-default' }">
			<template #header="{ collapsed }">
				<SidebarHeader :collapsed="collapsed" />
			</template>

			<!-- Grouped Navigation Sections -->
			<template #default="{ collapsed }">
				<template v-for="group in navigationGroups" :key="group.label">
					<UNavigationMenu :collapsed="collapsed" :items="group.links" orientation="vertical" tooltip popover />
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
const { navigationGroups, showSidebar } = storeToRefs(appUiStore);
</script>
