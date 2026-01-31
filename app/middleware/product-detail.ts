export default defineNuxtRouteMiddleware((to) => {
	const code = to.params.code;
	if (!code) {
		return navigateTo('/products/listing');
	}
});
