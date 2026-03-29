import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const query = getQuery(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Tag Id is required',
			});
		}

		const result = await signedFetch(event, `${Routes.ProdTags.Update(Number(id))}`, {
			method: 'PATCH',
			query: query,
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
