import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const query = getQuery(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Product Option Id is required',
			});
		}

		const result = await $fetch(`${Routes.ProdOptions.Remove(Number(id))}`, {
			baseURL: config.public.baseUrl,
			method: 'DELETE',
			query: query,
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
