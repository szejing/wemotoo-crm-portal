import { KEY } from '~/utils/constants/key';

export default defineNuxtRouteMiddleware(async (to, _from) => {
	if (import.meta.client) {
		const accessToken = useCookie(KEY.ACCESS_TOKEN);

		// clear access token
		if (to.path === '/login' && accessToken.value) {
			const authStore = useAuthStore();
			authStore.clearCookies();
		}

		if (!accessToken.value && to.path !== '/login') {
			return navigateTo('/login');
		}
	}
});
