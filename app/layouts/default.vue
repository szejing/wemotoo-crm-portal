<template>
	<UDashboardGroup>
		<UDashboardSidebar id="default" v-model:open="showSidebar" collapsible resizable class="bg-elevated/25" :ui="{ footer: 'lg:border-t lg:border-default' }">
			<template #header="{ collapsed }">
				<SidebarHeader :collapsed="collapsed" />
			</template>

			<!-- Grouped Navigation Sections -->
			<template #default="{ collapsed }">
				<template v-for="nav in navigations" :key="`${nav.label}-${route.path}`">
					<UNavigationMenu :collapsed="collapsed" :items="navItemsWithOpen(nav.links)" orientation="vertical" type="multiple" @update:model-value="() => {}">
						<template #item-label="{ item }">
							<ULink v-if="item.to && Array.isArray(item.children) && item.children.length" :to="item.to" class="block size-full" @click.stop>
								{{ item?.label }}
							</ULink>
							<template v-else>
								{{ item?.label }}
							</template>
						</template>
					</UNavigationMenu>
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
const route = useRoute();
const appUiStore = useAppUiStore();
const { navigations, showSidebar } = storeToRefs(appUiStore);

const pathMatchesLink = (path: string, link: { to?: string; children?: unknown[] }): boolean => {
	if (!link.to || typeof link.to !== 'string') return false;
	const to = link.to === '/' ? '/' : link.to.replace(/\/$/, '');
	return path === to || (to !== '/' && path.startsWith(to + '/'));
};

// In vertical mode Nuxt UI uses AccordionRoot with defaultValue from item.defaultOpen only (not modelValue).
// Pass items with defaultOpen: true for the parent that contains the current route; key by route.path so the menu
// re-mounts on route change and the correct section is expanded. Parent items use #item-label slot with ULink
// so click navigates to parent route; @click.stop prevents accordion toggle.
const navItemsWithOpen = (links: Array<Record<string, unknown>>): Array<Record<string, unknown>> => {
	const path = route.path;
	return links.map((link) => ({
		...link,
		defaultOpen: !!(Array.isArray(link.children) && link.children.length && pathMatchesLink(path, link as { to?: string; children?: unknown[] })),
	}));
};
</script>
