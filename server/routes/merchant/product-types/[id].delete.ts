import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Product Type Id is required',
			});
		}

		const result = await signedFetch(event, `${Routes.ProdTypes.Remove(Number(id))}`, {
			method: 'DELETE',
			});
		return result;
	} catch (err) {
		return err;
	}
});
