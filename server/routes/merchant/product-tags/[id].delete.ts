import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Tag Id is required',
			});
		}

		const result = await signedFetch(event, `${Routes.ProdTags.Delete(Number(id))}`, {
			method: 'DELETE',
			});
		return result;
	} catch (err) {
		return err;
	}
});
