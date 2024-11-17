import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const result = await $fetch(`${Routes.ProductTag.Single('as')}`, {
			baseURL: config.public.baseUrl,
			method: 'GET',
			body: data,
			headers: generateHeaders(event, true),
		});
		return result;
	} catch (err) {
		return err;
	}
});
