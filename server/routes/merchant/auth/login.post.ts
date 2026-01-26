import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const result = await $fetch(`${Routes.Auth.Login()}`, {
			baseURL: config.public.baseUrl,
			method: 'POST',
			body: data,
			headers: generateHeaders(event, false, data.merchant_id),
		});
		return result;
	} catch (err) {
		return err;
	}
});
