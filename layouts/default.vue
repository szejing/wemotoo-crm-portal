<template>
	<div>
		<Topbar />
		<div class="flex">
			<Sidebar />
			<div class="transform duration-200" :class="showSidebar ? 'ml-60' : 'ml-12'">
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const sidebarStore = useSidebarStore();

const { showSidebar } = storeToRefs(sidebarStore);
</script>

<style scoped lang="css"></style>
