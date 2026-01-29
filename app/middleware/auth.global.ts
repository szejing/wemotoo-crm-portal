import { KEY } from '~/composables/useWemotooCommon';

const publicPaths = ['/login', '/forgot-password', '/reset-password'];

export default defineNuxtRouteMiddleware(async (to, _from) => {
	if (import.meta.client) {
		const accessToken = useCookie(KEY.ACCESS_TOKEN);

		if (to.path === '/login' && accessToken.value) {
			const authStore = useAuthStore();
			authStore.clearCookies();
		}

		if (!accessToken.value && !publicPaths.includes(to.path)) {
			return navigateTo('/login');
		}
	}
});
