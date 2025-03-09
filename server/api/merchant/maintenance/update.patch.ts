import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const query = getQuery(event);

		const result = await $fetch(`${Routes.Maintenance.Update()}`, {
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
