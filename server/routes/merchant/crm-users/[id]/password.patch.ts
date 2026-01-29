import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const id = getRouterParams(event).id;
		const body = await readBody(event);

		if (!id) {
			throw createError({ statusCode: 400, statusMessage: 'CRM user id is required' });
		}

		const result = await $fetch(Routes.CrmUsers.UpdatePassword(id), {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			headers: generateHeaders(event, true),
			body,
		});
		return result;
	} catch (err) {
		return err;
	}
});
