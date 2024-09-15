<template>
	<div class="bg-slate-100 min-h-screen">
		<Topbar />
		<div class="flex">
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
	@apply p-8;
}
</style>
