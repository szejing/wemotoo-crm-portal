export default defineNuxtRouteMiddleware(async (to, _from) => {
	const code = to.params.code;
	const productStore = useProductStore();
	const { current_product } = storeToRefs(productStore);

	if (!current_product.value) {
		const product = await productStore.getProduct(code as string);

		if (product) {
			productStore.current_product = product;
		} else {
			return navigateTo('/products/listing');
		}
	}

	return;
});
