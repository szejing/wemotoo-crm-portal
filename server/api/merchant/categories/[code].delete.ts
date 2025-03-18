import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const code = getRouterParam(event, 'code');

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Category Code is required',
			});
		}

		const result = await $fetch(`${Routes.Categories.Remove(code)}`, {
			baseURL: config.public.baseUrl,
			method: 'DELETE',
			headers: generateHeaders(event),
		});

		return result;
	} catch (err) {
		return err;
	}
});
