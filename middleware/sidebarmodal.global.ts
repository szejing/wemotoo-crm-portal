export default defineNuxtRouteMiddleware((_to, _from) => {
	const sidebarStore = useSidebarStore();

	const { showSidebarModal } = storeToRefs(sidebarStore);
	showSidebarModal.value = false;
});
