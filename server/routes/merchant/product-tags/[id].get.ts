import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Tag Id is required',
			});
		}

		const result = await $fetch(`${Routes.ProdTags.Single(Number(id))}`, {
			baseURL: config.public.baseUrl,
			method: 'GET',
			body: data,
			headers: generateHeaders(event, true),
		});
		return result;
	} catch (err) {
		return err;
	}
});
