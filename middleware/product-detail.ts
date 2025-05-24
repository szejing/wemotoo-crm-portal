import { failedNotification } from '~/stores/AppUi/AppUi';

export default defineNuxtRouteMiddleware(async (_, _from) => {
	const productStore = useProductStore();
	const { current_product } = storeToRefs(productStore);

	if (!current_product.value) {
		failedNotification('Product not found');
		return navigateTo('/products');
	}

	return;
});
