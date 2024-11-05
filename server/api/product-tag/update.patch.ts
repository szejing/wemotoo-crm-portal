import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const query = getQuery(event);
		const accessToken = getCookie(event, 'accessToken') || '';

		const result = await $fetch(`${Routes.ProductTag.Update()}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			query: query,
			body: data,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-api-key': config.public.apiKey,
				'Authorization': 'Bearer ' + accessToken,
			},
		});
		return result;
	} catch (err) {
		return err;
	}
});
