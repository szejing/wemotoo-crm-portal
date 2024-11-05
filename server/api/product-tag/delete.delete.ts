import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const query = getQuery(event);
		const accessToken = getCookie(event, 'accessToken') || '';

		const result = await $fetch(`${Routes.ProductTag.Remove()}`, {
			baseURL: config.public.baseUrl,
			method: 'DELETE',
			query: query,
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
