export default defineNuxtPlugin(async (_) => {
	if (import.meta.client) {
		try {
			const authStore = useAuthStore();
			const result = await authStore.verify();
			if (!result) {
				authStore.clearCookies();
				navigateTo('/login');
			}

			const appStore = useAppStore();
			await appStore.init();
		} catch {
			navigateTo('/login');
		}
	}
});
