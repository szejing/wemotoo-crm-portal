export default defineNuxtRouteMiddleware((_to, _from) => {
	const appUiStore = useAppUiStore();

	const { showSidebarModal } = storeToRefs(appUiStore);
	showSidebarModal.value = false;
});
