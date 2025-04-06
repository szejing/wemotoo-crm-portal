import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Currency Code is required',
			});
		}

		const result = await $fetch(`${Routes.Currencies.Single(code)}`, {
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
