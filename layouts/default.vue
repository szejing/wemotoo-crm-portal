<template>
	<div class="default-bg">
		<ClientOnly>
			<Topbar />
			<div class="flex w-screen h-full">
				<Sidebar />

				<div class="main-content" :class="['ml-0 w-full', showSidebar ? 'md:ml-60 md:w-[calc(100vw-15rem)]' : 'md:ml-12 md:w-[calc(100vw-3rem)]']">
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
	@apply px-8 py-4 transform duration-500;
}
</style>
