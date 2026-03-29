import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Product Option Id is required',
			});
		}

		const result = await signedFetch(event, `${Routes.ProdVariations.Restore(Number(id))}`, {
			method: 'PATCH',
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
