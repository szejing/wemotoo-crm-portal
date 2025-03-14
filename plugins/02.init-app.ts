import { KEY } from '~/utils/constants/key';

export default defineNuxtPlugin(async (_) => {
	if (import.meta.client) {
		try {
			const cookie_access_token = useCookie(KEY.ACCESS_TOKEN) || '';
			const cookie_merchant_id = useCookie(KEY.X_MERCHANT_ID) || '';

			if (!cookie_access_token.value || !cookie_merchant_id.value) {
				navigateTo('/login');
				return;
			}

			const authStore = useAuthStore();
			const result = await authStore.verify();
			if (!result) {
				authStore.clearCookies();
				navigateTo('/login');
				return;
			}
			const appStore = useAppStore();
			await appStore.init();
		} catch {
			navigateTo('/login');
		}
	}
});
