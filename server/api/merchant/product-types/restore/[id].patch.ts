import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Product Type Id is required',
			});
		}

		const result = await $fetch(`${Routes.ProdTypes.Restore(Number(id))}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			headers: generateHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
