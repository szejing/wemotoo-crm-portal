import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const query = getQuery(event);

		const result = await $fetch(`${Routes.PaymentTypeGroups.Many()}`, {
			baseURL: config.public.baseUrl,
			method: 'GET',
			headers: generateHeaders(event, true),
			query: query,
		});
		return result;
	} catch (err) {
		return err;
	}
});
