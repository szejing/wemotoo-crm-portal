import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const query = getQuery(event);
		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Maintenance Code is required',
			});
		}

		const result = await $fetch(`${Routes.Maintenances.Remove(code)}`, {
			baseURL: config.public.baseUrl,
			method: 'DELETE',
			query: query,
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
