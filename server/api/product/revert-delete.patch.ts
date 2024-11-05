import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const accessToken = getCookie(event, 'accessToken') || '';

		const result = await $fetch(`${Routes.Product.RevertRemove()}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
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
