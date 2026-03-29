import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const code = getRouterParams(event).code;

		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Outlet Code is required',
			});
		}

		const result = await signedFetch(event, `${Routes.Outlets.Delete(code)}`, {
			method: 'DELETE',
		});
		return result;
	} catch (err) {
		return err;
	}
});
