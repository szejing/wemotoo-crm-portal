export default defineNuxtRouteMiddleware((to, _from) => {
	if (import.meta.client) {
		const accessToken = useCookie('accessToken');

		// clear access token
		if (to.path === '/login' && accessToken.value) {
			const token = useCookie('accessToken');
			token.value = null;
		}

		if (!accessToken.value && to.path !== '/login') {
			return navigateTo('/login');
		}
	}
});
