import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const query = getQuery(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Product Option Id is required',
			});
		}

		const result = await $fetch(`${Routes.ProdOptions.Update(Number(id))}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			query: query,
			body: data,
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
