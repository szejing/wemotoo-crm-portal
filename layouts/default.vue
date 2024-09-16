<template>
	<div class="default-bg">
		<Topbar />
		<div class="flex w-s=creen h-full">
			<Sidebar />
			<div class="main-content" :class="showSidebar ? 'ml-60' : 'ml-12'">
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const sidebarStore = useSidebarStore();

const { showSidebar } = storeToRefs(sidebarStore);
</script>

<style scoped lang="css">
.default-bg {
	@apply bg-slate-100 min-h-screen;
}

.main-content {
	@apply w-full px-8 py-4 transform duration-500;
}
</style>
