import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);

		const result = await $fetch(`${Routes.Auth.Verify()}`, {
			baseURL: config.public.baseUrl,
			method: 'POST',
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
