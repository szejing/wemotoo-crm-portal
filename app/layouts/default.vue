<template>
	<UDashboardGroup>
		<UDashboardSidebar id="default" v-model:open="showSidebar" collapsible resizable class="bg-elevated/25" :ui="{ footer: 'lg:border-t lg:border-default' }">
			<template #header="{ collapsed }">
				<SidebarHeader :collapsed="collapsed" />
			</template>

			<!-- Grouped Navigation Sections: render on client to avoid hydration mismatch and initial flash -->
			<template #default="{ collapsed }">
				<ClientOnly>
					<template v-for="nav in navigations" :key="`${nav.label}-${route.path}`">
						<UNavigationMenu
							:collapsed="collapsed"
							:items="navItemsWithOpen(nav.links)"
							orientation="vertical"
							type="multiple"
							:ui="{
								content: 'overflow-hidden data-[state=open]:animate-nav-accordion-down data-[state=closed]:animate-nav-accordion-up',
							}"
							@update:model-value="() => {}"
						>
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
					<template #fallback>
						<div class="min-h-[200px] space-y-2 px-2 py-2" aria-hidden="true">
							<template v-for="i in 8" :key="i">
								<div class="flex items-center gap-3 rounded-md px-2 py-2.5">
									<USkeleton class="h-5 w-5 shrink-0 rounded" />
									<USkeleton class="h-4 flex-1 max-w-[140px]" />
								</div>
							</template>
						</div>
					</template>
				</ClientOnly>
			</template>

			<template #footer="{ collapsed }">
				<ZUserMenu :collapsed="collapsed" />
			</template>
		</UDashboardSidebar>
		<div class="flex flex-1 flex-col min-w-0">
			<header class="flex shrink-0 items-center gap-2 border-b border-default px-4 py-2">
				<UDashboardSidebarCollapse />
			</header>
			<slot />
		</div>
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

const navItemsWithOpen = (links: Array<Record<string, unknown>>): Array<Record<string, unknown>> => {
	const path = route.path;
	return links.map((link) => ({
		...link,
		defaultOpen: !!(Array.isArray(link.children) && link.children.length && pathMatchesLink(path, link as { to?: string; children?: unknown[] })),
	}));
};
</script>
