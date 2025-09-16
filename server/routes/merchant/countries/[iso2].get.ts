import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const iso2 = getRouterParams(event).iso2;

		if (!iso2) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Country ISO2 is required',
			});
		}

		const result = await $fetch(`${Routes.Countries.Single(iso2)}`, {
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
