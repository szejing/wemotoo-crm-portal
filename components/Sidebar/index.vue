<template>
	<div class="sidebar" :class="showSidebar ? 'translate-x-0 ease-out' : '-translate-x-[12rem] ease-in'">
		<div v-if="!forcedShow" class="flex items-center justify-end pt-4 px-4">
			<UIcon :name="showSidebar ? ICONS.CLOSE_ROUNDED : ICONS.CHEVRON_DOUBLE_RIGHT" class="w-5 h-5 text-secondary-100" @click="toggleSidebar" />
		</div>
		<div class="space-y-2 px-2">
			<SidebarHeader class="py-10" />
			<SidebarNavigation />
		</div>
	</div>
</template>

<script lang="ts" setup>
const appUiStore = useAppUiStore();

const { forcedShow, showSidebar } = storeToRefs(appUiStore);
const { toggleSidebar } = appUiStore;
</script>

<style scoped lang="css">
.header-container {
	@apply px-4 py-10 border-b-[1px] border-secondary-400;
}

.sidebar {
	@apply fixed z-50 left-0 inset-y-0 w-60 bg-secondary-600 border-r overflow-y-auto transform duration-200 hidden md:block;
}
</style>
