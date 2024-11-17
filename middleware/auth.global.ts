import { KEY } from '~/utils/constants/key';

export default defineNuxtRouteMiddleware((to, _from) => {
	if (import.meta.client) {
		const accessToken = useCookie(KEY.ACCESS_TOKEN);

		// clear access token
		if (to.path === '/login' && accessToken.value) {
			const token = useCookie(KEY.ACCESS_TOKEN);
			token.value = null;
		}

		if (!accessToken.value && to.path !== '/login') {
			return navigateTo('/login');
		}
	}
});
