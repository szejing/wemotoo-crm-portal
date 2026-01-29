import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Brand Code is required',
			});
		}

		const result = await $fetch(`${Routes.ProductBrands.Restore(code)}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			body: data,
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
