import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({ statusCode: 400, statusMessage: 'CRM user id is required' });
		}

		const result = await $fetch(Routes.CrmUsers.Single(id), {
			baseURL: config.public.baseUrl,
			method: 'GET',
			headers: generateHeaders(event, true),
		});
		return result;
	} catch (err) {
		return err;
	}
});
