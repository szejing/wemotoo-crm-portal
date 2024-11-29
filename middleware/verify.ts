// import { KEY } from '~/utils/constants/key';

// export default defineNuxtRouteMiddleware(async (to, _from) => {
// 	if (import.meta.client) {
// 		const accessToken = useCookie(KEY.ACCESS_TOKEN);
// 		if (to.path === '/login' && accessToken.value) {
// 			const authStore = useAuthStore();
// 			authStore.clearCookies();
// 			return;
// 		}

// 		try {
// 			const authStore = useAuthStore();
// 			const result = await authStore.verify();

// 			if (!result) {
// 				return navigateTo('/login');
// 			}
// 		} catch {
// 			return navigateTo('/login');
// 		}
// 	}
// });
