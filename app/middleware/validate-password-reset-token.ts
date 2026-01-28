export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore();
	const isValid = await authStore.validateResetPasswordToken(to.query.token as string);

	if (!isValid) {
		return navigateTo('/login');
	}
});
