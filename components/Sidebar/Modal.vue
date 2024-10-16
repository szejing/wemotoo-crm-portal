<template>
	<UModal v-model="showSidebarModal" :ui="{ background: 'bg-secondary-600', width: 'w-full' }">
		<div class="space-y-2 px-2 py-4">
			<SidebarNavigation />
		</div>
	</UModal>
</template>

<script lang="ts" setup>
const sidebarStore = useSidebarStore();

const { showSidebarModal } = storeToRefs(sidebarStore);

// <UCard
// :ui="{
//   background: 'bg-secondary-600',
//   header: {
//     base: '',
//     background: '',
//     padding: 'px-4 py-5 sm:px-6',
//   },
//   body: {
//     base: 'container mx-auto',
//     background: '',
//     padding: 'px-4 py-5 sm:p-6',
//   },
// }"
// >
// <template #header>
//   <div class="flex-jbetween-icenter">
//     <UIcon name="i-material-symbols-close-rounded" class="size-7 text-white" @click="toggleSidebarModal" />
//   </div>
//   <SidebarHeader class="py-4" />
// </template>

// </UCard>
</script>

<style scoped lang="css"></style>
