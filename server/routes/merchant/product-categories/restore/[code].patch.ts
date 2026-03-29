import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Category Code is required',
			});
		}

		const result = await signedFetch(event, `${Routes.ProdCategories.Restore(code)}`, {
			method: 'PATCH',
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
