import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const query = getQuery(event);
		const iso2 = getRouterParams(event).iso2;

		if (!iso2) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Country ISO2 is required',
			});
		}

		const result = await $fetch(`${Routes.Countries.Update(iso2)}`, {
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
