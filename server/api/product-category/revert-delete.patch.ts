import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const result = await $fetch(`${Routes.ProdCategory.RevertRemove()}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			body: data,
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