import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = getQuery(event);

		const result = await $fetch(`${Routes.ProductTag.Remove()}`, {
			baseURL: config.public.baseUrl,
			method: 'DELETE',
			query: data,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-api-key': config.public.apiKey,
			},
		});
		return result;
	} catch (err) {
		return err;
	}
});
