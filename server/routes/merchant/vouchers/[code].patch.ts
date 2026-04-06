import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const query = getQuery(event);
		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Code is required',
			});
		}

		const result = await signedFetch(event, `${Routes.Vouchers.Update(code)}`, {
			method: 'PATCH',
			query: query,
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
