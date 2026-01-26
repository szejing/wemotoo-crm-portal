import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const query = getQuery(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Tag Id is required',
			});
		}

		const result = await $fetch(`${Routes.ProdTags.Update(Number(id))}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			query: query,
			body: data,
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
