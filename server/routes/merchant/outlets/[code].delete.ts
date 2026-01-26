import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Outlet Code is required',
			});
		}

		const result = await $fetch(`${Routes.Outlets.Delete(code)}`, {
			baseURL: config.public.baseUrl,
			method: 'DELETE',
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
