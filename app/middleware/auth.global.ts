import { KEY } from '~/composables/useWemotooCommon';
import { useAuthStore } from '~/stores';

const publicPaths = ['/login', '/forgot-password', '/reset-password'];

export default defineNuxtRouteMiddleware(async (to, _from) => {
	const accessToken = useCookie(KEY.ACCESS_TOKEN);

	// Client-only: visiting login while a cookie exists clears stale session cookies (existing behavior).
	if (import.meta.client && to.path === '/login' && accessToken.value) {
		const authStore = useAuthStore();
		authStore.clearCookies();
	}

	// Must run on server too; otherwise SSR renders the protected layout while the client redirects to /login,
	// causing hydration mismatches (e.g. UDashboardGroup shell vs auth layout).
	if (!accessToken.value && !publicPaths.includes(to.path)) {
		return navigateTo('/login');
	}
});
