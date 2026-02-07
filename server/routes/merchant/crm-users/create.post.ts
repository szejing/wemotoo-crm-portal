import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const result = await $fetch(Routes.CrmUsers.Create(), {
			baseURL: config.public.baseUrl,
			method: 'POST',
			headers: generateHeaders(event, true),
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
