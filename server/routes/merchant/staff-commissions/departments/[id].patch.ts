import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const id = getRouterParams(event).id;
		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Staff position id is required',
			});
		}
		const body = await readBody(event);
		const result = await signedFetch(event, Routes.StaffCommissions.Department(id), {
			method: 'PATCH',
			body,
		});
		return result;
	} catch (err) {
		return err;
	}
});
