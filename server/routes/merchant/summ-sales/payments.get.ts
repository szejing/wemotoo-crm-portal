import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const query = getQuery(event);

		const result = await $fetch(`${Routes.SummSales.Payments()}`, {
			baseURL: config.public.baseUrl,
			method: 'GET',
			query,
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
