<template>
	<div class="sidebar" :class="showSidebar ? 'translate-x-0 ease-out' : '-translate-x-[12rem] ease-in'">
		<div v-if="!forcedShow" class="flex items-center justify-end p-4">
			<UIcon :name="showSidebar ? 'i-heroicons-x-mark' : 'i-heroicons-chevron-double-right'" class="w-5 h-5 text-secondary-100" @click="toggleSidebar" />
		</div>
		<div class="space-y-4 px-2 mt-4">
			<SidebarHeader />
			<div v-for="(navigate, index) in navigations" :key="index" class="flex flex-col">
				<NuxtLink :to="navigate.to" class="active-link" exact-active-class="exact-active-link">
					<div class="flex items-center gap-4">
						<UIcon v-if="navigate.icon" :name="navigate.icon" class="w-5 h-5" />
						{{ navigate.title }}
					</div>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useSidebarStore } from '~/stores';

const sidebarStore = useSidebarStore();

const { forcedShow, showSidebar, navigations } = storeToRefs(sidebarStore);
const { toggleSidebar } = sidebarStore;
</script>

<style scoped lang="css">
/**************************** sidebar styling ****************************/
.sidebar {
	@apply absolute z-50 left-0 inset-y-0 w-60 bg-secondary-600 border-r overflow-y-auto transform duration-200;
}

.active-link {
	@apply p-4 mx-2 rounded-md text-base font-light cursor-pointer text-secondary-100 bg-transparent
	hover:bg-main-50 hover:text-secondary-700 hover:font-semibold transition duration-500 ease-in-out;
}
.exact-active-link {
	@apply bg-main-50 text-secondary-700 font-semibold;
}
</style>
