<template>
	<UModal v-model="showSidebarModal" :ui="{ background: 'bg-secondary-600', width: 'w-full' }">
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

<style scoped lang="postcss"></style>
