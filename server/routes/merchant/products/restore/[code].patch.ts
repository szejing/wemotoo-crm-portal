import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Product Code is required',
			});
		}

		const result = await $fetch(`${Routes.Products.Restore(code)}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
