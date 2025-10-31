<template>
	<UModal v-model:open="showSidebarModal" :ui="{ wrapper: 'bg-secondary-600', content: 'w-full' }">
		<SidebarHeader class="py-4" />
		<div class="space-y-2 px-2 py-4">
			<SidebarNavigation />
		</div>
	</UModal>
</template>

<script lang="ts" setup>
const appUiStore = useAppUiStore();

const { showSidebarModal } = storeToRefs(appUiStore);
</script>

<style scoped></style>
