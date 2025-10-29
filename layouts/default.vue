<template>
	<div class="default-bg">
		<ClientOnly>
			<Topbar />
			<div class="flex h-full">
				<Sidebar />

				<div class="main-content" :class="['ml-0 w-full', showSidebar ? 'md:ml-60 md:w-[calc(100vw-60rem)]' : 'md:ml-12 md:w-[calc(100vw-12rem)]']">
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
	background-color: #f1f5f9; /* slate-100 */
	min-height: 100vh;
}

.main-content {
	padding: 0.5rem; /* px-2 py-2 */
	transform: translateX(0);
	transition-duration: 500ms;
}

@media (min-width: 640px) {
	.main-content {
		padding: 1rem; /* sm:px-4 sm:py-4 */
	}
}
</style>
