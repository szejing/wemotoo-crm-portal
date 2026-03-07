import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const code = getRouterParams(event).code;
		const variant_code = getRouterParams(event).variant_code;

		if (!code || !variant_code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Product Code is required',
			});
		}

		const result = await $fetch(`${Routes.Products.DeleteVariant(code, variant_code)}`, {
			method: 'DELETE',
			});
		return result;
	} catch (err) {
		return err;
	}
});
