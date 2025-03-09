import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const result = await $fetch(`${Routes.Maintenance.RevertRemove()}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			body: data,
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
