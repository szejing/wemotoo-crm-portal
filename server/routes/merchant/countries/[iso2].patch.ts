import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const query = getQuery(event);
		const iso2 = getRouterParams(event).iso2;

		if (!iso2) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Country ISO2 is required',
			});
		}

		const result = await signedFetch(event, `${Routes.Countries.Update(iso2)}`, {
			method: 'PATCH',
			query: query,
			body: data,
			});
		return result;
	} catch (err) {
		return err;
	}
});
