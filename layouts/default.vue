<template>
	<div class="default-bg">
		<ClientOnly>
			<Topbar />
			<div class="flex w-s=creen h-full">
				<Sidebar />

				<div class="main-content" :class="['ml-0', showSidebar ? 'md:ml-60' : 'md:ml-12']">
					<slot />
				</div>
			</div>

			<SidebarModal />

			<template #fallback>
				<div class="w-full h-svh flex-col-center bg-primary-500">
					<ZLoader />
				</div>
			</template>
		</ClientOnly>
	</div>
</template>

<script lang="ts" setup>
const appUiStore = useAppUiStore();

const { showSidebar } = storeToRefs(appUiStore);
</script>

<style scoped lang="postcss">
.default-bg {
	@apply bg-slate-100 min-h-screen;
}

.main-content {
	@apply w-full px-8 py-4 transform duration-500;
}
</style>
