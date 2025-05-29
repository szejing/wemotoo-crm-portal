import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const code = getRouterParams(event).code;

		const result = await $fetch(`${Routes.ProdBrands.Single(code)}`, {
			baseURL: config.public.baseUrl,
			method: 'GET',
			headers: generateHeaders(event, true),
		});
		return result;
	} catch (err) {
		return err;
	}
});
