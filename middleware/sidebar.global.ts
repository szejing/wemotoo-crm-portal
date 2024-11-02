export default defineNuxtRouteMiddleware((_to, _from) => {
	if (import.meta.client) {
		const appUiStore = useAppUiStore();
		const { showSidebarModal } = storeToRefs(appUiStore);
		showSidebarModal.value = false;
	}
});
